// src/groups/groups.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/groups.entity';
import { CreateGroupDto } from './dto/create-group.dto'; 
import { UpdateGroupDto } from './dto/update-group.dto'; 

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  // 1. CREATE
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const newGroup = this.groupsRepository.create(createGroupDto);
    return this.groupsRepository.save(newGroup);
  }

  // 2. READ ALL (שליפת כל הקבוצות)
  async findAll(): Promise<Group[]> {
    return this.groupsRepository.find({ 
      // טוען את פרטי המוצר
      relations: ['product'] 
    });
  }

  // 3. READ ONE
  async findOne(id: string): Promise<Group> {
    const group = await this.groupsRepository.findOne({ 
      where: { id },
      // 🛑 תיקון: שימוש בשם היחס הנכון (memberships) כפי שהוגדר ב-groups.entity.ts
      relations: ['product', 'memberships', 'transactions'] // ✅ תוקן!
    });
    
    if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  // 4. UPDATE (למשל, שינוי סטטוס או דדליין)
  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);
    const updatedGroup = this.groupsRepository.merge(group, updateGroupDto);
    return this.groupsRepository.save(updatedGroup);
  }

  // 5. DELETE
  async remove(id: string): Promise<void> {
    const result = await this.groupsRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Group with ID ${id} not found`);
    }
  }
}