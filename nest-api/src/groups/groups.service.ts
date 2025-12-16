// src/groups/groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  async findAll(): Promise<Group[]> {
    return this.groupRepo.find();
  }

  async create(data: {
    name: string;
    description?: string;
    minParticipants?: number;
    isActive?: boolean;
  }): Promise<Group> {
    const group = this.groupRepo.create({
      name: data.name,
      description: data.description,
      minParticipants: data.minParticipants ?? 1,
      isActive: data.isActive ?? true,
    });

    return this.groupRepo.save(group);
  }

  async update(id: string, patch: Partial<Group>): Promise<Group> {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Group not found');

    if (patch.name !== undefined) group.name = patch.name;
    if (patch.description !== undefined) group.description = patch.description;
    if (patch.minParticipants !== undefined) group.minParticipants = patch.minParticipants;
    if (patch.isActive !== undefined) group.isActive = patch.isActive;

    return this.groupRepo.save(group);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Group not found');

    await this.groupRepo.remove(group);
    return { deleted: true };
  }
}
