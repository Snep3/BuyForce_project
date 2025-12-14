// src/product_images/product_images.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductImagesService } from './product_images.service'; 
import { ProductImage } from '../entities/product_images.entity'; 
import { CreateProductImageDto } from './dto/create-product-image.dto'; 
import { UpdateProductImageDto } from './dto/update-product-image.dto'; 

@Controller('product-images') // ✅ הנתיב הראשי של ה-API: /product-images
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {} 
  
  // POST /product-images
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    return this.productImagesService.create(createProductImageDto);
  }

  // GET /product-images/product/:productId (שליפת תמונות לפי מוצר)
  @Get('product/:productId')
  findAllByProductId(@Param('productId') productId: string): Promise<ProductImage[]> {
    return this.productImagesService.findAllByProductId(productId);
  }

  // PUT /product-images/:id
  @Put(':id')
  update(
    @Param('id') id: number, 
    @Body() updateProductImageDto: UpdateProductImageDto
  ): Promise<ProductImage> {
    return this.productImagesService.update(id, updateProductImageDto);
  }

  // DELETE /product-images/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: number): Promise<void> {
    return this.productImagesService.remove(id);
  }
}