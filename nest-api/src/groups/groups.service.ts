// src/groups/groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepo: Repository<GroupMember>,
  ) {}

  async create(dto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepo.create({
      name: dto.name,
      productId: dto.productId,
      minParticipants: dto.minParticipants ?? 1,
      isActive: dto.isActive ?? true,
    });

    return this.groupRepo.save(group);
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async update(id: string, dto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);

    if (dto.name !== undefined) {
      group.name = dto.name;
    }
    if (dto.productId !== undefined) {
      group.productId = dto.productId;
    }
    if (dto.minParticipants !== undefined) {
      group.minParticipants = dto.minParticipants;
    }
    if (dto.isActive !== undefined) {
      group.isActive = dto.isActive;
    }

    return this.groupRepo.save(group);
  }

  async remove(id: string): Promise<void> {
    await this.groupRepo.delete(id);
  }

  // לשימוש ב-API /orders והצד הציבורי
  async findByProduct(productId: string): Promise<Group | null> {
    return this.groupRepo.findOne({
      where: { productId },
    });
  }
}
