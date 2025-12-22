import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Group } from './group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  /**
   * מחזיר את כל הקבוצות עם פרטי המוצר
   */
  async findAll(): Promise<Group[]> {
    return this.groupRepo.find({ relations: ['product'] });
  }

  /**
   * מחזיר קבוצות לפי סטטוס פעילות
   */
  async findAllByStatus(status: string): Promise<Group[]> {
    const isActive = status === 'OPEN';
    return this.groupRepo.find({ 
      where: { status: status.toUpperCase() }, // המרה לאותיות גדולות וכל הסטטוסים בקונטרולר
      relations: ['product'] 
    });
  }

  /**
   * מחזיר אובייקט בודד
   * וודא שבישות (Entity) השדה נקרא 'memberships'
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
   * יצירת קבוצה חדשה
   * ה-Casting (as Group) בסוף פותר את שגיאת ה-Type 'Group[]' is missing...
   */
  async create(data: DeepPartial<Group>): Promise<Group> {
    const groupInstance = this.groupRepo.create(data); 
    // אנחנו מכריחים את הטיפוס להיות אובייקט בודד כי save יכול להחזיר גם מערך
    const savedGroup = await this.groupRepo.save(groupInstance);
    return savedGroup as Group;
  }

  /**
   * עדכון קבוצה קיימת
   */
  async update(id: string, patch: DeepPartial<Group>): Promise<Group> {
    await this.findOne(id); // בדיקת קיום
    await this.groupRepo.update(id, patch);
    const updated = await this.findOne(id);
    return updated as Group;
  }

  /**
   * מחיקת קבוצה
   */
  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    await this.groupRepo.remove(group);
  }
}