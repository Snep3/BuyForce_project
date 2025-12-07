// src/categories/categories.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service'; 
import { Category } from '../entities/categories.entity'; 
import { CreateCategoryDto } from './dto/create-category.dto'; 
import { UpdateCategoryDto } from './dto/update-category.dto'; 

@Controller('categories') // ✅ הנתיב הראשי של ה-API: /categories
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {} 
  
  // POST /categories
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  // GET /categories
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  // GET /categories/:id (שימו לב ל-Param('id') id: number)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  // PUT /categories/:id
  @Put(':id')
  update(
    @Param('id') id: number, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // DELETE /categories/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}