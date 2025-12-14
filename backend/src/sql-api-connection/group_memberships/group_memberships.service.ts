// src/group_memberships/group_memberships.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMembership } from '../entities/group_memberships.entity';
import { CreateGroupMembershipDto } from './dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from './dto/update-group-membership.dto';

@Injectable()
export class GroupMembershipsService {
  constructor(
    @InjectRepository(GroupMembership)
    private groupMembershipsRepository: Repository<GroupMembership>,
  ) {}

  // CREATE
  async create(createGroupMembershipDto: CreateGroupMembershipDto): Promise<GroupMembership> {
    // עכשיו השדות ב-DTO תואמים לשדות ב-Entity -> אפשר להעביר ישירות
    const newMembership = this.groupMembershipsRepository.create(createGroupMembershipDto);
    return this.groupMembershipsRepository.save(newMembership);
  }

  // שאר המתודות לא השתנו
  async findAll(): Promise<GroupMembership[]> {
    return this.groupMembershipsRepository.find({ relations: ['user', 'group'] });
  }

  async findOne(id: string): Promise<GroupMembership> {
    const membership = await this.groupMembershipsRepository.findOne({
      where: { id },
      relations: ['user', 'group', 'transaction'],
    });
    if (!membership) {
      throw new NotFoundException(`Group Membership with ID ${id} not found`);
    }
    return membership;
  }

  async update(id: string, updateGroupMembershipDto: UpdateGroupMembershipDto): Promise<GroupMembership> {
    const membership = await this.findOne(id);
    const updatedMembership = this.groupMembershipsRepository.merge(membership, updateGroupMembershipDto);
    return this.groupMembershipsRepository.save(updatedMembership);
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupMembershipsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Group Membership with ID ${id} not found`);
    }
  }
}
