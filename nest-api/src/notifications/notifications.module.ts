// src/notifications/notifications.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notifications.entity'; 
import { NotificationsService } from './notifications.service';
import { NotificationsController } from '../notifications/notifications.controller'; 
// יש לייבא את UsersModule אם NotificationsService צריך לגשת לנתוני משתמש

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]) // 🔑 חיבור ה-Entity
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService], 
})
export class NotificationsModule {}