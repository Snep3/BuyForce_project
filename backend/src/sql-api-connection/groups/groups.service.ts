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

  // 2. READ ALL (שליפת כל הקבוצות) - משמש עכשיו את GET /groups, מחזיר נתונים ל-GroupCardDto
  async findAll(): Promise<Group[]> {
    return this.groupsRepository.find({ 
      // 🔑 חיוני לחישוב progressPercent ולמשיכת שם המוצר ב-GroupCardDto
      relations: ['product'], 
      // מיון: קבוצות עם יותר חברים ובדדליין קרוב יוצגו קודם
      order: { joinedCount: 'DESC', deadline: 'ASC' } 
    });
  }
  
  // ----------------------------------------------------------------------
  // 🟢 פונקציה חדשה: שליפה לפי סטטוס (לדוגמה, עבור GET /groups/open)
  // ----------------------------------------------------------------------
  async findAllByStatus(status: string): Promise<Group[]> {
    return this.groupsRepository.find({ 
      where: { status },
      relations: ['product'], 
      order: { joinedCount: 'DESC', deadline: 'ASC' } 
    });
  }
  // ----------------------------------------------------------------------

  // 3. READ ONE
  async findOne(id: string): Promise<Group> {
    const group = await this.groupsRepository.findOne({ 
      where: { id },
      // טוען את כל הקשרים הרלוונטיים לדף פרטי הקבוצה המלא
      relations: ['product', 'memberships', 'transactions'] 
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