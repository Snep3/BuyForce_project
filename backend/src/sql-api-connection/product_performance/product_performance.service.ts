import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPerformance} from '../entities/product_performance.entity';
import { ProductPerformanceDto } from './dto/product_performance.dto';

@Injectable()
export class ProductPerformanceService {
  constructor(
    @InjectRepository(ProductPerformance)
    private performanceRepository: Repository<ProductPerformance>,
  ) {}

  /**
   * Upsert: יוצר או מעדכן שורת ביצועים עבור product_id נתון.
   */
  async upsert(dto: ProductPerformanceDto): Promise<ProductPerformance> {
    // **תיקון:** השתמש ב-create() והוסף await
    const newPerformance = this.performanceRepository.create( dto );
    return await this.performanceRepository.save(newPerformance);
  }

  /**
   * שליפת ביצועי מוצר לפי מזהה.
   */
  async findOne(productId: string): Promise<ProductPerformance> {
    // בדיקה: ודא ש'productId' תואם את ה-Entity
    const performance = await this.performanceRepository.findOne({ 
      where: { product_Id: productId } 
    });
    
    if (!performance) {
      throw new NotFoundException(`Product performance for ID ${productId} not found.`);
    }
    return performance;
  }
}