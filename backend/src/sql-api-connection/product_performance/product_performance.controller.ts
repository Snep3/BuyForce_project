import { Controller, Get, Param, Put, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductPerformanceService } from './product_performance.service';
import { ProductPerformance } from '../entities/product_performance.entity';
import { ProductPerformanceDto } from './dto/product_performance.dto';

@Controller('product-performance') // הנתיב הראשי: /product-performance
export class ProductPerformanceController {
  constructor(private readonly service: ProductPerformanceService) {}

  // 1. ניתוב לשליפת ביצועים לפי ID
  // GET /product-performance/{id}
  @Get(':id')
  async findOne(@Param('id') productId: string): Promise<ProductPerformance> {
    // ה-ValidationPipe יוודא שה-ID הוא UUID תקין
    return this.service.findOne(productId);
  }

  // 2. ניתוב לעדכון/יצירת ביצועים (Upsert)
  // PUT /product-performance
  // נניח שזהו Endpoint פנימי או שדורש אימות (Authorization)
  @Put()
  @HttpCode(HttpStatus.OK)
  async upsert(@Body() dto: ProductPerformanceDto): Promise<ProductPerformance> {
    return this.service.upsert(dto);
  }
}