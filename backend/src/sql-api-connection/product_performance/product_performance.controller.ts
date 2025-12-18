import { Controller, Get, Param, Put, Body, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ProductPerformanceService } from './product_performance.service';
import { ProductPerformance } from '../entities/product_performance.entity';
import { ProductPerformanceDto } from './dto/product_performance.dto'; // DTO כתיבה
import { ProductMetricsDto } from './dto/product-metrics.dto'; // 🔑 DTO קריאה

@Controller('product-performance') 
@UseInterceptors(ClassSerializerInterceptor) // 🔑 הפעלת DTOs
export class ProductPerformanceController {
  constructor(private readonly service: ProductPerformanceService) {}

  // 1. GET /product-performance/:id (שליפת ביצועים ל-Frontend)
  @Get(':id')
  // 🔑 שינוי חתימה ל-DTO קריאה
  async findOne(@Param('id') productId: string): Promise<ProductMetricsDto> { 
    return this.service.findOne(productId);
  }

  // 2. PUT /product-performance (עדכון/יצירה - שימוש פנימי/Admin)
  // 🛑 אם זהו Endpoint רגיש, יש להוסיף כאן AdminGuard
  @Put()
  @HttpCode(HttpStatus.OK)
  async upsert(@Body() dto: ProductPerformanceDto): Promise<ProductPerformance> {
    // מחזיר Entity, כי זהו Endpoint פנימי שצריך את כל הפרטים.
    return this.service.upsert(dto); 
  }
}