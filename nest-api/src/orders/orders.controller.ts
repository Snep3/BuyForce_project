// nest-api/src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    const userId = req.user?.userId; // כמו ב-JWT שלכם
    return this.ordersService.createOrder(userId, dto);
  }

  @Get('my')
  async getMyOrders(@Req() req) {
    const userId = req.user?.userId;
    return this.ordersService.getMyOrders(userId);
  }

  // ביטול הזמנה – רק של המשתמש המחובר
  @Patch(':id/cancel')
  async cancelOrder(@Req() req, @Param('id') id: string) {
    const userId = req.user?.userId;
    return this.ordersService.cancelOrder(userId, id);
  }
}
