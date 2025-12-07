import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../entities/products.entity'; // ייבוא ה-Entity

@Module({
  imports: [
    // הגדרת Entity לשימוש ב-TypeOrmModule
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  // ייצוא השירות אם הוא נדרש על ידי מודולים אחרים
  exports: [ProductsService], 
})
export class ProductsModule {}