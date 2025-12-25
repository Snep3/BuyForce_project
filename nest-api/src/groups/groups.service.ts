import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Group, GroupStatus } from './group.entity';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  /**
   * Returns all groups with products
   */
  async findAll(): Promise<Group[]> {
    return this.groupRepo.find({ relations: ['product'] });
  }

  /**
   * Returns groups by status
   */
  async findAllByStatus(status: string): Promise<Group[]> {
    return this.groupRepo.find({ 
      where: { status: status.toUpperCase() as any }, 
      relations: ['product'] 
    });
  }

  /**
   * Find single group
   */
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

  /**
   * Create a new group
   */
  async create(data: DeepPartial<Group>): Promise<Group> {
    const groupInstance = this.groupRepo.create(data); 
    const savedGroup = await this.groupRepo.save(groupInstance);
    return savedGroup as Group;
  }

  /**
   * Update existing group
   */
  async update(id: string, patch: DeepPartial<Group>): Promise<Group> {
    await this.findOne(id); 
    await this.groupRepo.update(id, patch);
    return this.findOne(id);
  }

  /**
   * Remove group
   */
  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    await this.groupRepo.remove(group);
  }

  /**
   * Increments member count AND updates status immediately if goal reached
   */
  async incrementJoinedCount(id: string): Promise<Group> {
    const group = await this.findOne(id);

    if (group.status !== GroupStatus.OPEN) {
      throw new BadRequestException(`Cannot join group with status: ${group.status}`);
    }

    // Check deadline before incrementing
    const now = new Date();
    if (group.deadline && now > new Date(group.deadline)) {
      group.status = GroupStatus.FAILED;
      await this.groupRepo.save(group);
      throw new BadRequestException('Deadline has passed, group failed.');
    }

    group.joined_count = (group.joined_count || 0) + 1;

    // IMMEDIATE UPDATE: If target reached, set to COMPLETED
    if (group.joined_count >= group.target_members) {
      group.status = GroupStatus.COMPLETED;
      this.logger.log(`Group ${id} reached target and is now COMPLETED.`);
    }

    return this.groupRepo.save(group);
  }

  /**
   * Automated Cron Job: Runs every hour
   * Checks for expired groups and sets them to FAILED if goal not reached
   */
   @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Running automated status check...');
    const now = new Date();

    const expiredGroups = await this.groupRepo.find({
      where: {
        status: GroupStatus.OPEN,
        deadline: LessThan(now),
      },
    });

    for (const group of expiredGroups) {
      if (group.joined_count < group.target_members) {
        group.status = GroupStatus.FAILED;
        await this.groupRepo.save(group);
        this.logger.log(`Group ${group.name} set to FAILED due to deadline.`);
      } else {
        // Safety check: if reached target but cron caught it first
        group.status = GroupStatus.COMPLETED;
        await this.groupRepo.save(group);
      }
    }
  }

  /**
   * Groups near goal (2 or less members away)
   */
  async getGroupsNearGoal() {
    return await this.groupRepo
      .createQueryBuilder('group')
      .where('group.status = :status', { status: GroupStatus.OPEN })
      .andWhere('group.target_members - group.joined_count <= 2') 
      .andWhere('group.target_members - group.joined_count > 0')
      .getMany();
  }
}