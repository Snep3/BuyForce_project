// src/categories/categories.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity'; // 👈 ודא נתיב נכון
import { CreateCategoryDto } from './dto/create-category.dto'; 
import { UpdateCategoryDto } from './dto/update-category.dto'; 

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  // 1. CREATE
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(newCategory);
  }

  // 2. READ ALL (שליפת כל הקטגוריות)
  async findAllForAdmin(): Promise<Category[]> {
    return this.categoriesRepository.find({ 
      // טוען את כל המוצרים המקושרים לקטגוריה
      relations: ['products'] 
    });
  }

  // 3. READ ONE
  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ 
      where: { id },
      relations: ['products']
    });
    
    // id הוא integer בטבלה זו
    if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // 4. UPDATE
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    const updatedCategory = this.categoriesRepository.merge(category, updateCategoryDto);
    return this.categoriesRepository.save(updatedCategory);
  }

  // 5. DELETE
  async remove(id: number): Promise<void> {
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
  async findAllForUi(): Promise<Category[]> {
    return this.categoriesRepository.find({ 
      // 🔑 משיכת שדות ספציפיים בלבד
      select: ['id', 'name', 'slug', 'iconUrl', 'sortOrder'] as (keyof Category)[],
      // 🔑 ודא שאין JOIN מיותר
      relations: [], 
      // 🔑 סידור לפי הסדר שנקבע
      order: { sortOrder: 'ASC' }
    });
  }
}