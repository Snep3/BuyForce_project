import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPerformance } from '../entities/product_performance.entity';
import { ProductPerformanceDto } from './dto/product_performance.dto';

@Injectable()
export class ProductPerformanceService {
  constructor(
    @InjectRepository(ProductPerformance)
    private performanceRepository: Repository<ProductPerformance>,
  ) {}

  /**
   * Upsert: יוצר או מעדכן שורת ביצועים עבור productId נתון.
   */
  async upsert(dto: ProductPerformanceDto): Promise<ProductPerformance> {
    const newPerformance = this.performanceRepository.create({
      productId: dto.productId,              // תואם ל-DTO
      views7d: dto.views7d ?? 0,
      joins7d: dto.joins7d ?? 0,
      wishlistAdds7d: dto.wishlistAdds7d ?? 0,
      conversionRate: dto.conversionRate ?? 0,
    });

    return await this.performanceRepository.save(newPerformance);
  }

  /**
   * שליפת ביצועי מוצר לפי מזהה.
   */
  async findOne(productId: string): Promise<ProductPerformance> {
    const performance = await this.performanceRepository.findOne({
      where: { productId: productId }, // תואם ל-DTO ול-Entity
    });

    if (!performance) {
      throw new NotFoundException(`Product performance for ID ${productId} not found.`);
    }
    return performance;
  }
}
