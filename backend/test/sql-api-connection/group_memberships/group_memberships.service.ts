// src/group_memberships/group_memberships.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMembership } from '../entities/group_memberships.entity'; // 👈 ודא נתיב נכון
import { CreateGroupMembershipDto } from './dto/create-group-membership.dto'; 
import { UpdateGroupMembershipDto } from './dto/update-group-membership.dto'; 

@Injectable()
export class GroupMembershipsService {
  constructor(
    @InjectRepository(GroupMembership)
    private groupMembershipsRepository: Repository<GroupMembership>,
  ) {}

  // 1. CREATE
  async create(createGroupMembershipDto: CreateGroupMembershipDto): Promise<GroupMembership> {
    const newMembership = this.groupMembershipsRepository.create(createGroupMembershipDto);
    return this.groupMembershipsRepository.save(newMembership);
  }

  // 2. READ ALL (שליפת כל החברות)
  async findAll(): Promise<GroupMembership[]> {
    return this.groupMembershipsRepository.find({ 
      // טוען את פרטי הקבוצה והמשתמש
      relations: ['user', 'group'] 
    });
  }

  // 3. READ ONE
  async findOne(id: string): Promise<GroupMembership> {
    const membership = await this.groupMembershipsRepository.findOne({ 
      where: { id },
      relations: ['user', 'group', 'transaction']
    });
    
    if (!membership) {
        throw new NotFoundException(`Group Membership with ID ${id} not found`);
    }
    return membership;
  }

  // 4. UPDATE (למשל, עדכון סטטוס)
  async update(id: string, updateGroupMembershipDto: UpdateGroupMembershipDto): Promise<GroupMembership> {
    const membership = await this.findOne(id);
    const updatedMembership = this.groupMembershipsRepository.merge(membership, updateGroupMembershipDto);
    return this.groupMembershipsRepository.save(updatedMembership);
  }

  // 5. DELETE (ביטול חברות)
  async remove(id: string): Promise<void> {
    const result = await this.groupMembershipsRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Group Membership with ID ${id} not found`);
    }
  }
}