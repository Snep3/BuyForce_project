// src/product_images/product_images.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ProductImagesService } from './product_images.service'; 
import { ProductImage } from '../entities/product_images.entity'; 
import { CreateProductImageDto } from './dto/create-product-image.dto'; 
import { UpdateProductImageDto } from './dto/update-product-image.dto'; 
import { ProductImageDto } from './dto/product-image.dto'; // 🔑 ייבוא DTO קריאה

@Controller('product-images')
// 🔑 הוספת Interceptor כדי שההמרה ל-DTO תתבצע אוטומטית
@UseInterceptors(ClassSerializerInterceptor) 
export class ProductImagesController {
    constructor(private readonly productImagesService: ProductImagesService) {} 
    
    // ----------------------------------------------------------------------
    // 🟢 Flow A: GET /product-images/product/:productId (שליפת כל התמונות לעמוד מוצר)
    // ----------------------------------------------------------------------
    @Get('product/:productId')
    // 🔑 כעת מחזיר ProductImageDto[]
    findAllByProductId(@Param('productId') productId: string): Promise<ProductImageDto[]> {
        return this.productImagesService.findAllByProductId(productId);
    }

    // ----------------------------------------------------------------------
    // 🟢 Flow B: GET /product-images/product/:productId/primary (שליפת תמונה ראשית לכרטיס)
    // ----------------------------------------------------------------------
    @Get('product/:productId/primary')
    // 🔑 מחזיר ProductImageDto (או null אם לא נמצא)
    findPrimaryByProductId(@Param('productId') productId: string): Promise<ProductImageDto | null> {
        return this.productImagesService.findPrimaryImageByProductId(productId);
    }

    // ----------------------------------------------------------------------
    // 🟢 Endpoints CRUD (לשימוש Admin/מפתחים)
    // ----------------------------------------------------------------------

    // POST /product-images
    @Post()
    @HttpCode(HttpStatus.CREATED) 
    // 🔑 שינוי חתימה: מחזיר ProductImageDto (ה-Interceptor מטפל בהמרה)
    create(@Body() createProductImageDto: CreateProductImageDto): Promise<ProductImageDto> {
        // הוספת as unknown as Promise<ProductImageDto> כדי לרצות את TypeScript
        return this.productImagesService.create(createProductImageDto) as unknown as Promise<ProductImageDto>;
    }

    // PUT /product-images/:id
    @Put(':id')
    // 🔑 שינוי חתימה: מחזיר ProductImageDto 
    update(
        @Param('id') id: number, 
        @Body() updateProductImageDto: UpdateProductImageDto
    ): Promise<ProductImageDto> {
        // הוספת as unknown as Promise<ProductImageDto>
        return this.productImagesService.update(id, updateProductImageDto) as unknown as Promise<ProductImageDto>;
    }

    // DELETE /product-images/:id
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) 
    remove(@Param('id') id: number): Promise<void> {
        return this.productImagesService.remove(id);
    }
}