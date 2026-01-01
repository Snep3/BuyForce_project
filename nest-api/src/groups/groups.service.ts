// src/groups/groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Group } from './group.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  /**
   * מוסיף לכל קבוצה נתוני סטטוס:
   * participantsCount, remainingToTarget, progressPercent, isFull
   */
  private async addStatsToGroups(groups: Group[]) {
    if (!groups.length) return [];

    const groupIds = groups.map((g) => g.id);

    // כל ההזמנות האקטיביות בקבוצות האלה (לא מבוטלות)
    const orders = await this.orderRepo.find({
      where: {
        groupId: In(groupIds),
        status: Not('canceled'),
      },
    });

    const participantsMap = new Map<string, Set<string>>();

    for (const order of orders) {
      if (!order.groupId) continue;
      let set = participantsMap.get(order.groupId);
      if (!set) {
        set = new Set<string>();
        participantsMap.set(order.groupId, set);
      }
      if (order.userId) {
        set.add(order.userId);
      }
    }

    return groups.map((group) => {
      const participantsSet = participantsMap.get(group.id) ?? new Set();
      const participantsCount = participantsSet.size;

      const min = group.minParticipants || 0;
      const remainingToTarget =
        min > 0 ? Math.max(0, min - participantsCount) : 0;

      const progressPercent =
        min > 0
          ? Math.min(100, Math.round((participantsCount / min) * 100))
          : 0;

      const isFull = remainingToTarget <= 0;

      return {
        ...group,
        stats: {
          participantsCount,
          minParticipants: min,
          remainingToTarget,
          progressPercent,
          isFull,
        },
      };
    });
  }

  // ----- לשימוש כללי / אדמין -----

  async findAll() {
    const groups = await this.groupRepo.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
    return this.addStatsToGroups(groups);
  }

  async findOne(id: string) {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!group) throw new NotFoundException('Group not found');
    const [withStats] = await this.addStatsToGroups([group]);
    return withStats;
  }

  // קבוצות לפי מוצר – לדף מוצר
  async findByProduct(productId: string) {
    const groups = await this.groupRepo.find({
      where: { productId },
      relations: ['product'],
      order: { createdAt: 'ASC' },
    });
    return this.addStatsToGroups(groups);
  }

  // הקבוצות שהמשתמש שייך אליהן (יש לו הזמנה לא מבוטלת בקבוצה)
  async getGroupsForUser(userId: string) {
    if (!userId) return [];

    const userOrders = await this.orderRepo.find({
      where: { userId, status: Not('canceled') },
      relations: ['group', 'group.product'],
      order: { createdAt: 'DESC' },
    });

    const groupsMap = new Map<string, Group>();
    for (const order of userOrders) {
      if (order.group) {
        groupsMap.set(order.group.id, order.group);
      }
    }

    const groups = Array.from(groupsMap.values());
    return this.addStatsToGroups(groups);
  }

  // ----- CRUD לקבוצות (אדמין) -----

  async create(dto: CreateGroupDto) {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found for group');
    }

    const group = this.groupRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      minParticipants: dto.minParticipants,
      isActive: dto.isActive ?? true,
      product,
      productId: product.id,
    });

    const saved = await this.groupRepo.save(group);
    const [withStats] = await this.addStatsToGroups([saved]);
    return withStats;
  }

  async update(id: string, dto: UpdateGroupDto) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Group not found');

    if (dto.name !== undefined) group.name = dto.name;
    if (dto.description !== undefined) group.description = dto.description;
    if (dto.minParticipants !== undefined)
      group.minParticipants = dto.minParticipants;
    if (dto.isActive !== undefined) group.isActive = dto.isActive;

    if (dto.productId !== undefined) {
      const product = await this.productRepo.findOne({
        where: { id: dto.productId },
      });
      if (!product) {
        throw new NotFoundException('Product not found for group');
      }
      group.product = product;
      group.productId = product.id;
    }

    const saved = await this.groupRepo.save(group);
    const [withStats] = await this.addStatsToGroups([saved]);
    return withStats;
  }

  async remove(id: string) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Group not found');
    await this.groupRepo.remove(group);
    return { success: true };
  }
}
