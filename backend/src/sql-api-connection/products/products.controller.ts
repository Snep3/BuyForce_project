// src/sql-api-connection/products/products.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service'; 
import { Product } from '../entities/products.entity'; 
import { CreateProductDto } from './dto/create-product.dto'; 
import { UpdateProductDto } from './dto/update-product.dto'; 

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {} 
  
  // POST /products
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }
    
  // GET /products
  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // GET /products/:id (ה-ID הוא UUID ולכן string)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // PUT /products/:id
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /products/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}