// src/product_images/product_images.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { ProductImage } from '../entities/product_images.entity'; 
import { CreateProductImageDto } from './dto/create-product-image.dto'; 
import { UpdateProductImageDto } from './dto/update-product-image.dto';

// נניח שייבאת את ה-Service של המוצרים אם אתה רוצה לוודא קיום מוצר
// import { ProductsService } from '../products/products.service'; 

@Injectable()
export class ProductImagesService {
  // 1. הזרקת ה-Repository של TypeORM
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    // private readonly productsService: ProductsService, // אם נדרשת ולידציה של product_id
  ) {}

  // 1. יצירת תמונה חדשה (POST /product-images)
  async create(createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    // התיקון הקודם כבר שם: שימוש ב-createProductImageDto.productId (ב-camelCase)
    // אופציונלי: ולידציה ש-product_id קיים
    // await this.productsService.findOne(createProductImageDto.productId); 
    
    // יצירת אובייקט Entity חדש מה-DTO.
    const newImage = this.productImageRepository.create(createProductImageDto);
    
    // שמירה במסד הנתונים והחזרת הרשומה השמורה
    return this.productImageRepository.save(newImage);
  }

  // 2. שליפת כל התמונות של מוצר מסוים (GET /product-images/product/:productId)
  async findAllByProductId(productId: string): Promise<ProductImage[]> {
    return this.productImageRepository.find({
      // ⬅️ נשאר: שימוש במאפיין ה-Entity: productId
      where: { productId: productId }, 
      // ⬅️ נשאר: שימוש במאפייני ה-Entity: sortOrder, createdAt
      order: { sortOrder: 'ASC', createdAt: 'ASC' }, 
    });
  }
  
  // 3. מציאת תמונה ספציפית לפי ID (פונקציה פנימית לשימוש העדכון והמחיקה)
  async findOneOrFail(id: number): Promise<ProductImage> {
    // שימוש ב-where: { id } תקין.
    const image = await this.productImageRepository.findOne({ where: { id } }); 
    
    if (!image) {
      // זריקת שגיאה אם התמונה לא נמצאה
      throw new NotFoundException(`Product image with ID ${id} not found.`);
    }
    return image;
  }

  // 4. עדכון תמונה קיימת (PUT /product-images/:id)
  async update(id: number, updateProductImageDto: UpdateProductImageDto): Promise<ProductImage> {
    const existingImage = await this.findOneOrFail(id); // מוודא קיום תמונה

    // מיזוג הנתונים המעודכנים לתוך האובייקט הקיים
    const updatedImage = this.productImageRepository.merge(existingImage, updateProductImageDto);

    // שמירה במסד הנתונים
    return this.productImageRepository.save(updatedImage);
  }

  // 5. מחיקת תמונה (DELETE /product-images/:id)
  async remove(id: number): Promise<void> {
    const result = await this.productImageRepository.delete(id);
    
    if (result.affected === 0) {
      // אם לא נמחקה אף רשומה (כלומר, ה-ID לא נמצא)
      throw new NotFoundException(`Product image with ID ${id} not found.`);
    }
    // החזרה ריקה (void) כפי שמתבקש מהקונטרולר
  }
}