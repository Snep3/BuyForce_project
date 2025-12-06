import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductSpecDto } from './dto/create-product-specs.dto'; 
import { ProductSpec } from '../entities/product_specs.entity'; 

@Injectable()
export class ProductSpecsService {
  constructor(
    @InjectRepository(ProductSpec)
    private specsRepository: Repository<ProductSpec>,
  ) {}

  // 1. CREATE: יצירת מפרט חדש
  async create(createSpecDto: CreateProductSpecDto): Promise<ProductSpec> {
    
    // מיפוי ה-DTO למופע Entity
    const newSpec = this.specsRepository.create(createSpecDto); 
    
    // שמירה ב-DB
    return await this.specsRepository.save(newSpec); 
  }

  // 2. READ ALL: שליפת כל המפרטים של מוצר ספציפי
  async findAllByProductId(productId: string): Promise<ProductSpec[]> {
    // שליפה לפי product_id (שם המאפיין ב-Entity הוא productId)
    return await this.specsRepository.find({ 
      where: { productId: productId },
      // מפרטים בדרך כלל מסודרים לפי המפתח או זמן יצירה
      order: { createdAt: 'ASC' } 
    });
  }
}