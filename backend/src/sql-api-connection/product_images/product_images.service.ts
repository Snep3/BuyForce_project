// src/product_images/product_images.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { plainToInstance } from 'class-transformer'; // 🔑 חיוני להמרה ל-DTO

import { ProductImage } from '../entities/product_images.entity'; 
import { CreateProductImageDto } from './dto/create-product-image.dto'; 
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImageDto } from './dto/product-image.dto'; // 🔑 ייבוא DTO קריאה

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

  // ----------------------------------------------------------------------
  // 1. CREATE (יצירת תמונה חדשה - שימוש מנהלי/פנימי)
  // ----------------------------------------------------------------------
  async create(createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    // יצירת אובייקט Entity חדש מה-DTO.
    const newImage = this.productImageRepository.create(createProductImageDto);
    
    // שמירה במסד הנתונים והחזרת הרשומה השמורה
    return this.productImageRepository.save(newImage);
  }

  // ----------------------------------------------------------------------
  // 2. READ (שליפת נתונים ל-Frontend - עם המרה ל-DTO)
  // ----------------------------------------------------------------------
  
  // 2.1. Flow A: שליפת כל התמונות לפי מוצר (לצורך עמוד המוצר)
  async findAllByProductId(productId: string): Promise<ProductImageDto[]> {
    const images = await this.productImageRepository.find({
        // 🥇 תיקון ה-WHERE: שימוש באובייקט היחס product וה-ID שלו
        where: { product: { id: productId } }, 
        order: { sortOrder: 'ASC', createdAt: 'ASC' }, // חיוני לסדר נכון
    });
    
    // 🔑 המרה ל-DTO לפני החזרה
    return plainToInstance(ProductImageDto, images, { excludeExtraneousValues: true });
  }
  
  // 2.2. Flow B: שליפת התמונה הראשית בלבד (לצורך כרטיס המוצר)
  async findPrimaryImageByProductId(productId: string): Promise<ProductImageDto | null> {
    // 💡 משתמשים במיון ולוקחים את הראשון (take: 1)
    const image = await this.productImageRepository.findOne({
        // 🥇 תיקון ה-WHERE: שימוש באובייקט היחס product וה-ID שלו
        where: { product: { id: productId } },
        order: { sortOrder: 'ASC', createdAt: 'ASC' }, 
        // אם יש שדה isPrimary=true ב-Entity, כדאי להוסיף אותו ל-where
    });

    if (!image) {
        return null; // אין תמונה
    }

    // 🔑 המרה ל-DTO
    return plainToInstance(ProductImageDto, image, { excludeExtraneousValues: true });
  }
  
  // 2.3. מציאת תמונה ספציפית לפי ID (פונקציה פנימית לשימוש העדכון והמחיקה)
  async findOneOrFail(id: number): Promise<ProductImage> {
    const image = await this.productImageRepository.findOne({ where: { id } }); 
    
    if (!image) {
      throw new NotFoundException(`Product image with ID ${id} not found.`);
    }
    return image;
  }

  // ----------------------------------------------------------------------
  // 3. UPDATE (עדכון תמונה קיימת)
  // ----------------------------------------------------------------------
  async update(id: number, updateProductImageDto: UpdateProductImageDto): Promise<ProductImage> {
    const existingImage = await this.findOneOrFail(id); // מוודא קיום תמונה

    // מיזוג הנתונים המעודכנים לתוך האובייקט הקיים
    const updatedImage = this.productImageRepository.merge(existingImage, updateProductImageDto);

    // שמירה במסד הנתונים
    return this.productImageRepository.save(updatedImage);
  }

  // ----------------------------------------------------------------------
  // 4. DELETE (מחיקת תמונה)
  // ----------------------------------------------------------------------
  async remove(id: number): Promise<void> {
    const result = await this.productImageRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Product image with ID ${id} not found.`);
    }
  }
}