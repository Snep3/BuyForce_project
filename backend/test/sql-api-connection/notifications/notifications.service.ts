// src/notifications/notifications.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notifications.entity'; // 👈 ודא נתיב נכון
import { CreateNotificationDto } from './dto/create-notification.dto'; 
import { UpdateNotificationDto } from './dto/update-notification.dto'; 

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  // 1. CREATE (ליצירת התראה חדשה)
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const newNotification = this.notificationsRepository.create(createNotificationDto);
    return this.notificationsRepository.save(newNotification);
  }

  // 2. READ ALL (שליפת כל ההתראות של משתמש ספציפי)
  async findAllByUserId(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({ 
      where: { userId: userId },
      order: { createdAt: 'DESC' } // התראות חדשות קודם
    });
  }

  // 3. READ ONE
  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({ 
      where: { id },
      relations: ['user'] // טוען את פרטי המשתמש
    });
    
    if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  // 4. UPDATE (למשל, שינוי סטטוס ל-SENT/READ)
  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    const updatedNotification = this.notificationsRepository.merge(notification, updateNotificationDto);
    return this.notificationsRepository.save(updatedNotification);
  }

  // 5. DELETE (אם נדרש)
  async remove(id: string): Promise<void> {
    const result = await this.notificationsRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }
}