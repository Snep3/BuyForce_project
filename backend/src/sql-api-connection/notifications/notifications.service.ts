// src/notifications/notifications.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notifications.entity'; 
import { User } from '../entities/users.entity'; // ✅ ייבוא User Entity (ודא נתיב נכון!)
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
    
    // 🛑 שינוי מינימלי 1: יצירת אובייקט עם הקישור המפורש (ה-ID נוצר ב-DB)
    const newNotificationData = {
      // מחק את השורה הזו כי ה-DB מייצר את ה-ID (בהנחה ש PrimaryGeneratedColumn תוקן):
      // id: uuid.v4(), 
      
      // ✅ פותר את שגיאת ה-NULL ב-user_id ע"י שימוש בקישור מפורש
      user: { id: createNotificationDto.user_id } as User, 
      ...createNotificationDto, // העתקת שאר השדות מה-DTO
    };
    
    const newNotification = this.notificationsRepository.create(newNotificationData);
    return this.notificationsRepository.save(newNotification);
  }

  // 2. READ ALL (שליפת כל ההתראות של משתמש ספציפי)
  async findAllByUserId(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({ 
      where: { userId: userId },
      order: { createdAt: 'DESC' } 
    });
  }
    // ... שאר המתודות נשארות כפי שהן ...
  // 3. READ ONE
  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
    
    if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  // 4. UPDATE
  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    const updatedNotification = this.notificationsRepository.merge(notification, updateNotificationDto);
    return this.notificationsRepository.save(updatedNotification);
  }

  // 5. DELETE
  async remove(id: string): Promise<void> {
    const result = await this.notificationsRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }
}