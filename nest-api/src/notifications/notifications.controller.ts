import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // שליפת ההתראות שלי
  @Get('my')
  getMyNotifications(@Req() req: any) {
    const userId = req.user.id;
    return this.notificationsService.getUserNotifications(userId);
  }

  // סימון התראה כנקראה
  @Patch(':id/read')
  markAsRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    return this.notificationsService.markAsRead(userId, id);
  }
}
