// src/admins/admins.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admins.entity';
import { CreateAdminDto } from './dto/create-admin.dto'; 
import { UpdateAdminDto } from './dto/update-admin.dto'; 

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
  ) {}

  // 1. CREATE
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
        console.log("--- DEBUG 1: Starting Admin Create ---");
    const newAdmin = this.adminsRepository.create(createAdminDto);
        console.log("--- DEBUG 2: Admin Entity created (userId: " + newAdmin.userId + ") ---");
    
    // 1. שמירה: מבצע את ה-INSERT ל-DB. הקיפאון יכול לקרות כאן.
    const savedAdmin = await this.adminsRepository.save(newAdmin);
        console.log("--- DEBUG 3: Admin saved successfully (ID: " + savedAdmin.id + ") ---");

    // 2. שליפה נקייה:
    const adminResult = await this.adminsRepository.findOne({ 
        where: { id: savedAdmin.id }
    });
        console.log("--- DEBUG 4: Admin retrieved successfully from DB ---");

    // 💡 התיקון לשגיאת TS2322: אופרטור Non-null Assertion
    return adminResult!; 
  }

  // 2. READ ALL (שליפת רשימת המנהלים)
  async findAll(): Promise<Admin[]> {
    return this.adminsRepository.find({ 
      // טוען את פרטי המשתמש שמאחורי האדמין
      relations: ['user'] 
    });
  }

  // 3. READ ONE
  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminsRepository.findOne({ 
      where: { id },
      relations: ['user', 'auditLogs'] // טוען את המשתמש ואת הלוגים שלו
    });
    
    if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  // 4. UPDATE (מאפשר עדכון תפקיד בלבד)
  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);
    
    // מיזוג נתונים חדשים (רק role)
    const updatedAdmin = this.adminsRepository.merge(admin, updateAdminDto);
    
    return this.adminsRepository.save(updatedAdmin);
  }

  // 5. DELETE
  async remove(id: string): Promise<void> {
    const result = await this.adminsRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }
}