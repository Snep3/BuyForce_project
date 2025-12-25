import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer'; // 🔑 חיוני להמרה ל-DTO

import { Notification } from './notifications.entity'; 
import { User } from '../users/user.entity'; // ✅ ייבוא User Entity (ודא נתיב נכון!)
import { CreateNotificationDto } from './dto/create-notification.dto'; 
import { UpdateNotificationDto } from './dto/update-notification.dto'; 
import { NotificationListDto, NotificationItemDto } from './dto/notification-list.dto'; // 🔑 ייבוא DTOs חדשים

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  // ----------------------------------------------------------------------
  // 1. CREATE (ליצירת התראה חדשה - שימוש פנימי/מנהלי)
  // ----------------------------------------------------------------------
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    
    // 🛑 שימוש בקישור מפורש כדי לפתור שגיאת NULL ב-user_id
    const newNotificationData = {
      user: { id: createNotificationDto.user_id } as User, 
      ...createNotificationDto, // העתקת שאר השדות מה-DTO
    };
    
    const newNotification = this.notificationsRepository.create(newNotificationData);
    return this.notificationsRepository.save(newNotification);
  }
    
  // ----------------------------------------------------------------------
  // 2. READ: שליפת רשימת התראות מותאמת ומאובטחת (Flow H)
  // ----------------------------------------------------------------------
  
  // 2.1. GET LIST (שליפת רשימת התראות מותאמת)
  async getNotificationsList(userId: string): Promise<NotificationListDto> {
        // 1. שליפת כל ההתראות של המשתמש, מסודרות מהחדש לישן
        const notifications = await this.notificationsRepository.find({
            where: { userId: userId }, // 🔑 חובה: אבטחה ברמת המשתמש
            order: { createdAt: 'DESC' },
            take: 50, // הגבלת הרשימה
        });

        // 2. חישוב מספר ההתראות הלא-נקראו
        const unreadCount = notifications.filter(n => n.status !== 'READ').length;
        
        // 3. המרת ה-Entities ל-NotificationItemDto (מבצעת את isRead: boolean)
        const itemsDto = plainToInstance(NotificationItemDto, notifications, { excludeExtraneousValues: true });

        return {
            items: itemsDto,
            unreadCount: unreadCount,
        };
  }

  // 2.2. READ ALL (שליפת כל ההתראות במערכת - Admin Only)
  async findAll(): Promise<Notification[]> {
        return this.notificationsRepository.find({ 
            order: { createdAt: 'DESC' } 
        });
  }

  // 2.3. READ ONE
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


  // ----------------------------------------------------------------------
  // 3. UPDATE (עדכונים)
  // ----------------------------------------------------------------------
  
  // 3.1. UPDATE STATUS (עדכון סטטוס מאובטח ע"י המשתמש - /:id/read)
  async updateStatus(
      id: string, 
      userId: string, 
      status: 'READ' | 'DELETED'
  ): Promise<NotificationItemDto> {
        // 1. בדיקת בעלות ואיתור ההתראה (חובה: בדיקת ID ההתראה + ID המשתמש)
        const notification = await this.notificationsRepository.findOne({ 
            where: { id, userId }, 
        });

        if (!notification) {
            throw new NotFoundException(`Notification with ID ${id} not found or does not belong to user.`);
        }

        // 2. עדכון הסטטוס
        notification.status = status;
        const updated = await this.notificationsRepository.save(notification);

        // 3. החזרת הנתונים כ-DTO
        return plainToInstance(NotificationItemDto, updated, { excludeExtraneousValues: true });
  }

  // 3.2. UPDATE (עדכון מלא - Admin Only)
  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
        const notification = await this.findOne(id);
        const updatedNotification = this.notificationsRepository.merge(notification, updateNotificationDto);
        return this.notificationsRepository.save(updatedNotification);
  }

  // ----------------------------------------------------------------------
  // 4. DELETE (Admin Only)
  // ----------------------------------------------------------------------
  async remove(id: string): Promise<void> {
        const result = await this.notificationsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Notification with ID ${id} not found`);
        }
  }
}