import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';

@Controller('combined')
export class CombinedGroupsController {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  // נתיב 1: דף הבית - עכשיו משתמש ב-QueryBuilder לביצוע JOIN מהיר
  @Get('groups-with-products')
  async getCombinedData() {
    const groups = await this.groupsRepository.createQueryBuilder('group')
      .leftJoinAndSelect('group.product', 'product') // JOIN מהיר למוצר
      .leftJoinAndSelect('product.images', 'image')   // JOIN מהיר לתמונות
      .where('group.activeGroup = :active', { active: true })
      .orderBy('group.createdAt', 'DESC') // אופציונלי: מציג קבוצות חדשות קודם
      .getMany();

    return this.mapGroups(groups);
  }

  // נתיב 2: חימוש משולב - כבר מבוסס QueryBuilder
  @Get('search')
  async searchGroups(@Query('q') query: string) {
    if (!query) return [];

    const searchTerm = `%${query}%`;

    const groups = await this.groupsRepository.createQueryBuilder('group')
      .leftJoinAndSelect('group.product', 'product')
      .leftJoinAndSelect('product.images', 'image')
      .where('group.activeGroup = :active', { active: true })
      .andWhere('(product.name ILIKE :searchTerm OR group.name ILIKE :searchTerm)', { searchTerm })
      .getMany();

    return this.mapGroups(groups);
  }

  // פונקציית עזר לפורמט ה-JSON (סעיף 3 בתוכנית שלך)
  private mapGroups(groups: Group[]) {
    return groups.map((group) => {
      const product = group.product;
      return {
        id: group.id,
        name: group.name,
        status: group.status,
        joinedCount: group.joined_count,
        targetCount: group.target_members,
        progress: group.progress_pct, 
        deadline: group.deadline,
        product: {
          id: product?.id,
          name: product?.name,
          priceRegular: Number(product?.priceRegular), 
          priceGroup: Number(product?.priceGroup),
          image: product?.images && product.images.length > 0 
            ? product.images[0].imageUrl 
            : 'https://placehold.co/600x400?text=No+Image',
          description: (!group.description || group.description.includes('allProductIds')) 
            ? product?.description 
            : group.description,
        }
      };
    });
  }
}