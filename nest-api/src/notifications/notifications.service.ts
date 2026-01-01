import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  // שליפת כל ההתראות של המשתמש
  getUserNotifications(userId: string) {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // סימון התראה כנקראה
  async markAsRead(userId: string, notificationId: string) {
    const notif = await this.notificationRepo.findOne({
      where: { id: notificationId, userId },
    });

    if (!notif) {
      throw new NotFoundException('Notification not found');
    }

    notif.isRead = true;
    return this.notificationRepo.save(notif);
  }

  // יצירת התראה (לשימוש פנימי)
  async createNotification(userId: string, type: string, message: string) {
    const notif = this.notificationRepo.create({
      userId,
      type,
      message,
    });

    return this.notificationRepo.save(notif);
  }
}
