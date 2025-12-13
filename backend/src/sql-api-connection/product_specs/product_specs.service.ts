// src/sql-api-connection/product_specs/product_specs.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; // הוספת BadRequestException (לא חובה אך מומלץ)
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductSpecDto } from './dto/create-product-specs.dto'; 
import { UpdateProductSpecDto } from './dto/update-product-spec.dto'; // נניח שייבוא זה נכון
import { ProductSpec } from '../entities/product_specs.entity'; 

@Injectable()
export class ProductSpecsService {
  constructor(
    @InjectRepository(ProductSpec)
    private specsRepository: Repository<ProductSpec>,
  ) {}

  // 1. CREATE: יצירת מפרט חדש
  async create(createSpecDto: CreateProductSpecDto): Promise<ProductSpec> {
    
    const newSpec = this.specsRepository.create(createSpecDto); 
    return await this.specsRepository.save(newSpec); 
  }
    
  // 2. READ ONE: שליפת מפרט בודד
  async findOne(id: number): Promise<ProductSpec> {
    
    const spec = await this.specsRepository.findOne({ 
      where: { id },
    });
    
    if (!spec) {
      throw new NotFoundException(`Product spec with ID ${id} not found.`);
    }
    return spec;
  }

  // 3. UPDATE ONE: עדכון מפרט בודד
  async update(id: number, updateSpecDto: UpdateProductSpecDto): Promise<ProductSpec> {
      const existingSpec = await this.findOne(id); 
      const updatedSpec = this.specsRepository.merge(existingSpec, updateSpecDto);
      return this.specsRepository.save(updatedSpec);
  }

  // 🛑 עדכון: עדכון/החלפה של כל המאפיינים של מוצר ספציפי 
  async updateAllByProductId(
      productId: string, 
      updateSpecsDto: CreateProductSpecDto[] // מקבל מערך של מאפיינים להחלפה
  ): Promise<ProductSpec[]> {
      
        // 🛑 בדיקה נוספת: מוודא שהקלט הוא מערך. אם לא, זורק שגיאת 400 ברורה.
        if (!Array.isArray(updateSpecsDto)) {
            throw new BadRequestException('The request body must be a JSON array of product specifications.');
        }

      // 1. מחיקת כל המאפיינים הקיימים עבור המוצר הזה
      // זהו החלק המכריע ב-PUT גלובלי (החלפה מלאה)
      await this.specsRepository.delete({ productId: productId }); // 

      // 2. יצירת רשומות חדשות מהמערך שנשלח
      const specsToSave = updateSpecsDto.map(dto => 
          // מבטיח שכל DTO מקבל את ה-productId הנכון מהנתיב
          this.specsRepository.create({ ...dto, productId: productId }) 
      );
      
      // 3. שמירת כל הרשומות החדשות ב-DB והחזרתן
      return await this.specsRepository.save(specsToSave); // 
  }

  // 4. READ ALL: שליפת כל המפרטים של מוצר ספציפי
  async findAllByProductId(productId: string): Promise<ProductSpec[]> {
    
    return await this.specsRepository.find({ 
      where: { productId: productId },
      order: { createdAt: 'ASC' } 
    });
  }
}