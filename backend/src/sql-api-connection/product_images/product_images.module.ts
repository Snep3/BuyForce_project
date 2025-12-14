// src/product_images/product_images.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from '../entities/product_images.entity'; 
import { ProductImagesService } from '../product_images/product_images.service';
import { ProductImagesController } from '../product_images/product_images.controller'; 
import { ProductsModule } from '../products/products.module'; // תלות אפשרית
//שאגיע לproduct השגיאה תיעלם

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]), // 🔑 חיבור ה-Entity
    ProductsModule // אם ה-Service צריך לוודא קיום מוצר
  ],
  providers: [ProductImagesService],
  controllers: [ProductImagesController],
  exports: [ProductImagesService], 
})
export class ProductImagesModule {}