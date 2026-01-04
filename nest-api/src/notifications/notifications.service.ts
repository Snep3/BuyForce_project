import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async getMyNotifications(userId: string) {
    return this.notificationsRepo.find({
      where: { user: { id: userId } },
      relations: { user: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationsRepo.findOne({
      where: { id: notificationId },
      relations: { user: true },
    });

    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.user?.id !== userId) throw new ForbiddenException('Not yours');

    if (!notification.isRead) {
      notification.isRead = true;
      await this.notificationsRepo.save(notification);
    }

    const { user, ...safe } = notification as any;
    return safe;
  }
}
