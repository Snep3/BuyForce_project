import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm'; // ייבוא DeepPartial נדרש לתיקון שגיאת create
import { CreateProductImageDto } from './dto/create-product-image.dto'; 
import { UpdateProductImageDto } from './dto/update-product-image.dto'; 
import { ProductImage } from '../../sql-api-connection/entities/product_images.entity'; 

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private productImagesRepository: Repository<ProductImage>,
  ) {}

  // 1. CREATE: יצירת תמונה חדשה (תיקון שגיאות TS2769 ו-TS2740)
  async create(createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    
    // **התיקון המוחלט לשגיאת הטיפוסים:**
    // 1. שימוש ב-Spread Operator ({...}) כדי להבטיח אובייקט נתונים פשוט (POJO).
    // 2. הקלדה מחדש כפויה (Type Assertion) ל-DeepPartial<ProductImage>
    //    כדי לעקוף את הקונפליקט בטיפוסים של TypeORM.
    const newImage = this.productImagesRepository.create(
        { ...createProductImageDto } as DeepPartial<ProductImage>
    ); 
    
    // 3. הוספת await ל-save() פותרת את שגיאת ה-return הנגררת (Promise)
    return await this.productImagesRepository.save(newImage); 
  }

  // 2. READ ALL (שליפת כל התמונות של מוצר ספציפי)
  async findAllByProductId(productId: string): Promise<ProductImage[]> {
    // הוספת await כדי לפתור שגיאות טיפוסים (Promise<ProductImage[]>)
    return await this.productImagesRepository.find({ 
      where: { productId: productId }, // ודא ש-productId הוא שם המאפיין הנכון ב-Entity
      order: { sortOrder: 'ASC' } 
    });
  }

  // 3. READ ONE: שליפת תמונה לפי ID
  async findOne(id: number): Promise<ProductImage> {
    const image = await this.productImagesRepository.findOne({ 
      where: { id }
    });
    
    if (!image) {
        throw new NotFoundException(`Product Image with ID ${id} not found`);
    }
    return image;
  }

  // 4. UPDATE: עדכון תמונה קיימת
  async update(id: number, updateProductImageDto: UpdateProductImageDto): Promise<ProductImage> {
    const image = await this.findOne(id);
    
    // שימוש ב-merge כדי לעדכן רק את השדות שהועברו ב-DTO
    const updatedImage = this.productImagesRepository.merge(image, updateProductImageDto);
    
    // שמירה עם await
    return await this.productImagesRepository.save(updatedImage);
  }

  // 5. DELETE: מחיקת תמונה
  async remove(id: number): Promise<void> {
    const result = await this.productImagesRepository.delete(id);
    
    if (result.affected === 0) {
        throw new NotFoundException(`Product Image with ID ${id} not found`);
    }
  }
}