import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSpecsService } from './product_specs.service';
import { ProductSpecsController } from './product-specs.controller';
import { ProductSpec } from '../entities/product_specs.entity'; // ייבוא ה-Entity

@Module({
  imports: [
    // הגדרת Entity לשימוש ב-TypeOrmModule
    TypeOrmModule.forFeature([ProductSpec]),
  ],
  controllers: [ProductSpecsController],
  providers: [ProductSpecsService],
  // אם מודול אחר צריך להשתמש ב-Service הזה
  exports: [ProductSpecsService], 
})
export class ProductSpecsModule {}