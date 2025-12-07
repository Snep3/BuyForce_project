// src/admins/admins.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admins.entity'; // 👈 ודא נתיב נכון
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
    const newAdmin = this.adminsRepository.create(createAdminDto);
    // TypeORM יטפל ב-createdAt באופן אוטומטי (ברירת מחדל NOW())
    return this.adminsRepository.save(newAdmin);
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