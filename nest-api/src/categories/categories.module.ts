// src/categories/categories.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories.entity'; 
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]) // 🔑 חיבור ה-Entity
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService], 
})
export class CategoriesModule {}