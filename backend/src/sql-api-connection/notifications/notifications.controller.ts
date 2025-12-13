// src/notifications/notifications.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service'; 
import { Notification } from '../entities/notifications.entity'; 
import { CreateNotificationDto } from './dto/create-notification.dto'; 
import { UpdateNotificationDto } from './dto/update-notification.dto'; 

@Controller('notifications') // ✅ הנתיב הראשי של ה-API: /notifications
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {} 
  
  // POST /notifications (לרוב לשימוש פנימי או ע"י Admin)
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }
    
    // 🛑 התיקון: GET /notifications/:id (שליפת התראה בודדת)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Notification> {
        // ההנחה היא שה-Service מכיל את מתודת findOne שכבר ראינו.
        return this.notificationsService.findOne(id);
    }
    

  // GET /notifications/user/:userId (שליפת כל ההתראות של משתמש)
  @Get('user/:userId')
  findAllByUserId(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationsService.findAllByUserId(userId);
  }

  // PUT /notifications/:id (למשל, כדי לסמן כ-READ)
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateNotificationDto: UpdateNotificationDto
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  // DELETE /notifications/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.notificationsService.remove(id);
  }
}