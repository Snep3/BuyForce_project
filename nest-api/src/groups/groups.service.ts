import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, LessThan, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Group, GroupStatus } from './group.entity';
import { GroupMembership } from '../group_memberships/group_memberships.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(GroupMembership)
    private readonly membershipRepo: Repository<GroupMembership>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async joinGroup(groupId: string, userId: string) {
    const existing = await this.membershipRepo.findOne({
      where: { groupId, userId }
    });

    if (existing) {
      throw new BadRequestException('You have already joined this group');
    }

    const group = await this.findOne(groupId);
    if (group.status !== GroupStatus.OPEN) {
      throw new BadRequestException('Group is not open for new members');
    }

    const membership = this.membershipRepo.create({
      groupId,
      userId,
      status: 'JOINED',
      amountGroupPrice: group.product?.priceGroup || 0
    });

    await this.membershipRepo.save(membership);
    await this.incrementJoinedCount(groupId);

    // מחזיר את הקבוצה המעודכנת עם המונה והחברים החדשים
    return this.findOne(groupId);
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepo.find({ relations: ['product'] });
  }
async findGroupsByUser(userId: string): Promise<any[]> {
    // 1. מציאת כל החברויות של המשתמש
    const memberships = await this.membershipRepo.find({
      where: { userId: userId as any },
      relations: ['group', 'group.product']
    });

    // 2. חילוץ הקבוצות
    const groups = memberships.map(m => m.group);

    // 3. בניית האובייקטים עם fullProducts וטיפול ב-Types
    return Promise.all(groups.map(async (group) => {
      let fullProducts: Product[] = []; 
      if (group.productIds && group.productIds.length > 0) {
        fullProducts = await this.productRepo.find({
          where: { id: In(group.productIds) }
        });
      }

      // אנחנו מחזירים אובייקט שכולל את ה-Getter באופן ידני או מחזירים כ-any
      return { 
        ...group, 
        fullProducts,
        progress_pct: group.progress_pct // העברת ה-Getter בצורה מפורשת לאובייקט החדש
      }; 
    }));
  }

 async findAllByStatus(status: string): Promise<any[]> {
    const groups = await this.groupRepo.find({ 
      where: { status: status.toUpperCase() as any }, 
      relations: ['product', 'memberships'],
      // תיקון: הוספת סדר קבוע לפי תאריך יצירה (מהישן לחדש)
      order: { createdAt: 'ASC' } 
    });

    return Promise.all(groups.map(async (group) => {
      let fullProducts: Product[] = []; 
      if (group.productIds && group.productIds.length > 0) {
        fullProducts = await this.productRepo.find({
          where: { id: In(group.productIds) }
        });
      }
      return { ...group, fullProducts }; 
    }));
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepo.findOne({ 
      where: { id: id as any }, 
      relations: ['product', 'memberships'] 
    });
    
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async getNearGoalGroups(): Promise<Group[]> {
    return await this.groupRepo.find({
      where: { status: GroupStatus.OPEN, activeGroup: true },
      relations: ['product'],
      order: { joined_count: 'DESC' },
      take: 5,
    });
  }

  async create(data: DeepPartial<Group>): Promise<Group> {
    const groupInstance = this.groupRepo.create(data); 
    return await this.groupRepo.save(groupInstance);
  }

  async update(id: string, patch: DeepPartial<Group>): Promise<Group> {
    await this.findOne(id); 
    await this.groupRepo.update(id, patch);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    await this.groupRepo.remove(group);
  }

  async leaveGroup(groupId: string, userId: string) {
    const membership = await this.membershipRepo.findOne({
      where: { groupId, userId }
    });

    if (!membership) {
      throw new BadRequestException('You are not a member of this group');
    }

    const group = await this.findOne(groupId);
    if (group.status !== GroupStatus.OPEN) {
      throw new BadRequestException('Cannot leave a group that is no longer open');
    }

    await this.membershipRepo.delete({ groupId, userId });
    await this.decrementJoinedCount(groupId);

    // מחזיר את הקבוצה המעודכנת לאחר העזיבה
    return this.findOne(groupId);
  }

  async incrementJoinedCount(id: string): Promise<void> {
    await this.groupRepo.increment({ id: id as any }, 'joined_count', 1);
    
    const group = await this.groupRepo.findOne({ where: { id: id as any } });
    if (group && group.joined_count >= group.target_members) {
      await this.groupRepo.update(id, { status: GroupStatus.COMPLETED });
    }
  }

  async decrementJoinedCount(id: string): Promise<void> {
    const group = await this.groupRepo.findOne({ where: { id: id as any } });
    if (group && group.joined_count > 0) {
      await this.groupRepo.decrement({ id: id as any }, 'joined_count', 1);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const now = new Date();
    const expiredGroups = await this.groupRepo.find({
      where: { status: GroupStatus.OPEN, deadline: LessThan(now) },
    });

    for (const group of expiredGroups) {
      group.status = group.joined_count < group.target_members ? GroupStatus.FAILED : GroupStatus.COMPLETED;
      await this.groupRepo.save(group);
    }
  }
}