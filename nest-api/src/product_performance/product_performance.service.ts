import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer'; // 🔑 הוספת ייבוא
import { ProductPerformance } from './product_performance.entity';
import { ProductPerformanceDto } from './dto/product_performance.dto'; // DTO כתיבה/עדכון
import { ProductMetricsDto } from './dto/product-metrics.dto'; // 🔑 DTO קריאה

@Injectable()
export class ProductPerformanceService {
  constructor(
    @InjectRepository(ProductPerformance)
    private performanceRepository: Repository<ProductPerformance>,
  ) {}

  /**
   * Upsert: יוצר או מעדכן שורת ביצועים עבור productId נתון. (נשאר ללא שינוי)
   */
  async upsert(dto: ProductPerformanceDto): Promise<ProductPerformance> {
    // ... (הלוגיקה נשארת כפי שהיא, מחזירה Entity) ...
    const newPerformance = this.performanceRepository.create({
      productId: dto.productId,
      views7d: dto.views7d ?? 0,
      joins7d: dto.joins7d ?? 0,
      wishlistAdds7d: dto.wishlistAdds7d ?? 0,
      conversionRate: dto.conversionRate ?? 0,
    });

    return await this.performanceRepository.save(newPerformance);
  }

  /**
   * שליפת ביצועי מוצר לפי מזהה והמרה ל-DTO.
   */
  async findOne(productId: string): Promise<ProductMetricsDto> { // 🔑 שינוי חתימה ל-DTO קריאה
    const performance = await this.performanceRepository.findOne({
      where: { productId: productId },
    });

    if (!performance) {
      throw new NotFoundException(`Product performance for ID ${productId} not found.`);
    }
    
    // 🔑 המרה ל-DTO לפני החזרה
    return plainToInstance(ProductMetricsDto, performance, { excludeExtraneousValues: true });
  }
}