// src/groups/groups.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(GroupMember)
    private readonly groupMemberRepo: Repository<GroupMember>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // -------------------------------------------------
  // חבילה 1 – לוגיקת קבוצות למשתמשים
  // -------------------------------------------------

  // רשימת כל הקבוצות
  async getAllGroups() {
    const groups = await this.groupRepo.find({
      relations: ['product', 'members'],
      order: { createdAt: 'DESC' },
    });

    return groups.map((g) => {
      const currentParticipants = g.members ? g.members.length : 0;

      const progress =
        g.minParticipants > 0
          ? Math.min(
              100,
              Math.round((currentParticipants / g.minParticipants) * 100),
            )
          : 0;

      return {
        id: g.id,
        name: g.name,
        description: g.description,
        minParticipants: g.minParticipants,
        isActive: g.isActive,
        productId: g.productId,
        product: g.product,
        currentParticipants,
        progress,
      };
    });
  }

  // הקבוצות שלי
  async getUserGroups(userId: string) {
    if (!userId) throw new BadRequestException('User not authenticated');

    const memberships = await this.groupMemberRepo.find({
      where: { userId },
      relations: ['group', 'group.product', 'group.members'],
      order: { joinedAt: 'DESC' },
    });

    return memberships.map((m) => {
      const g = m.group;
      const currentParticipants = g.members ? g.members.length : 0;

      const progress =
        g.minParticipants > 0
          ? Math.min(
              100,
              Math.round((currentParticipants / g.minParticipants) * 100),
            )
          : 0;

      return {
        id: g.id,
        name: g.name,
        description: g.description,
        minParticipants: g.minParticipants,
        isActive: g.isActive,
        productId: g.productId,
        product: g.product,
        currentParticipants,
        progress,
        joinedAt: m.joinedAt,
      };
    });
  }

  // הצטרפות לקבוצה
 async joinGroupWithPayment(userId: string, groupId: string) {
  if (!userId) {
    throw new BadRequestException('User not authenticated');
  }

  const group = await this.groupRepo.findOne({
    where: { id: groupId },
    relations: ['members'],
  });

  if (!group) throw new NotFoundException('Group not found');
  if (!group.isActive) throw new BadRequestException('Group is not active');

  // ❗ קבוצה שכבר הושלמה – אין כניסה
  if (group.isCompleted) {
    throw new BadRequestException('Group already completed');
  }

  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  const currentCount = await this.groupMemberRepo.count({
    where: { groupId: group.id },
  });

  if (currentCount >= group.minParticipants) {
    // ביטחון כפול
    group.isCompleted = true;
    group.completedAt = new Date();
    await this.groupRepo.save(group);

    throw new BadRequestException('Group already full');
  }

  const existing = await this.groupMemberRepo.findOne({
    where: { groupId: group.id, userId: user.id },
  });

  if (existing) {
    return {
      joined: false,
      alreadyMember: true,
      message: 'Already joined this group',
    };
  }

  const membership = this.groupMemberRepo.create({
    group,
    groupId: group.id,
    user,
    userId: user.id,
  });

  await this.groupMemberRepo.save(membership);

  const newCount = currentCount + 1;

  // 👇 כאן קסם — אם הקבוצה הגיעה ליעד
  if (newCount >= group.minParticipants) {
    group.isCompleted = true;
    group.completedAt = new Date();
    await this.groupRepo.save(group);

    // 👇 פה בעתיד נכניס Notifications + חיוב Stripe
  }

  return {
    joined: true,
    alreadyMember: false,
    groupId: group.id,
    currentParticipants: newCount,
    minParticipants: group.minParticipants,
    isCompleted: group.isCompleted,
  };
}



  // יציאה מקבוצה
  async leaveGroup(userId: string, groupId: string) {
    if (!userId) throw new BadRequestException('User not authenticated');

    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');

    if (!group.isActive) {
      throw new BadRequestException('Group already completed');
    }

    const membership = await this.groupMemberRepo.findOne({
      where: { groupId: group.id, userId },
    });

    if (!membership) {
      throw new BadRequestException('User is not a member of this group');
    }

    await this.groupMemberRepo.remove(membership);

    const membersCount = await this.groupMemberRepo.count({
      where: { groupId: group.id },
    });

    const progress =
      group.minParticipants > 0
        ? Math.min(
            100,
            Math.round((membersCount / group.minParticipants) * 100),
          )
        : 0;

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      minParticipants: group.minParticipants,
      isActive: group.isActive,
      productId: group.productId,
      currentParticipants: membersCount,
      progress,
    };
  }

  // קבוצה פעילה לפי מוצר
  async getActiveGroupByProduct(productId: string) {
    const group = await this.groupRepo.findOne({
      where: { productId, isActive: true },
      relations: ['members', 'product'],
    });

    if (!group) return null;

    const membersCount = await this.groupMemberRepo.count({
      where: { groupId: group.id },
    });

    const progress =
      group.minParticipants > 0
        ? Math.min(
            100,
            Math.round((membersCount / group.minParticipants) * 100),
          )
        : 0;

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      minParticipants: group.minParticipants,
      isActive: group.isActive,
      productId: group.productId,
      product: group.product,
      currentParticipants: membersCount,
      progress,
    };
  }

  // -------------------------------------------------
  // Admin CRUD
  // -------------------------------------------------

  async findAll() {
    return this.groupRepo.find({ relations: ['product'] });
  }

  async findOne(id: string) {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async create(dto: CreateGroupDto) {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new BadRequestException('Product not found');

    const group = this.groupRepo.create({
      name: dto.name,
      minParticipants: dto.minParticipants,
      isActive: dto.isActive ?? true,
      product,
      productId: product.id,
    });

    if (dto.description !== undefined) group.description = dto.description;

    return this.groupRepo.save(group);
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
      if (!product) throw new BadRequestException('Product not found');

      group.product = product;
      group.productId = product.id;
    }

    return this.groupRepo.save(group);
  }

  async remove(id: string) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Group not found');

    await this.groupRepo.remove(group);
    return { success: true };
  }
}
