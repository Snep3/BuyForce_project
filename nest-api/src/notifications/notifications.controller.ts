import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, Req, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { NotificationsService } from './notifications.service'; 
import { Notification } from './notifications.entity'; 
import { CreateNotificationDto } from './dto/create-notification.dto'; 
import { UpdateNotificationDto } from './dto/update-notification.dto'; 
import { NotificationListDto } from './dto/notification-list.dto'; 
// 🔑 נניח שמייבאים AdminGuard:
// import { AdminGuard } from '../../auth/admin.guard'; 


@Controller('notifications')
@UseInterceptors(ClassSerializerInterceptor) 
// ⚠️ כל המודול הזה כעת נגיש רק למנהלים/מפתחים:
// @UseGuards(AdminGuard) 
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {} 
  
  // ----------------------------------------------------------------------
  // 🟢 ENDPOINT לשליפת הכל (Admin/Monitoring)
  // ----------------------------------------------------------------------
  
  // GET /notifications - שליפת כל ההתראות במערכת
  @Get()
  findAll(): Promise<Notification[]> {
    // אין צורך בבדיקת userId אם ה-Guard עושה את העבודה
    return this.notificationsService.findAll();
  }
  
  // ----------------------------------------------------------------------
  // 🟢 Endpoints ה-CRUD למפתחים (POST/PUT/DELETE)
  // ----------------------------------------------------------------------
  
  // POST /notifications (ליצירת התראה על ידי מפתח)
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }
    
  // GET /notifications/:id 
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  // PUT /notifications/:id 
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
  
  // 🛑 הוסר: /me, /user/:userId, /:id/read - כי הלקוח לא מבצע פעולות אלה.
}