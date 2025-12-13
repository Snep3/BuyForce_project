// src/sql-api-connection/products/products.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity'; 
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller'; 

@Module({
  imports: [
    // 🔑 חיבור ה-Entity
    TypeOrmModule.forFeature([Product]) 
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService], 
})
export class ProductsModule {}