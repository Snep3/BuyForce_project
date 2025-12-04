// src/product_images/product_images.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductImageDto } from './dto/create-product-image.dto'; 
import { UpdateProductImageDto } from './dto/update-product-image.dto'; 
import { ProductImage } from '../../sql-api-connection/entities/product_images.entity';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private productImagesRepository: Repository<ProductImage>,
  ) {}

  // 1. CREATE
  async create(createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    const newImage = this.productImagesRepository.create(createProductImageDto);
    return this.productImagesRepository.save(newImage);
  }

  // 2. READ ALL (שליפת כל התמונות של מוצר ספציפי)
  async findAllByProductId(productId: string): Promise<ProductImage[]> {
    return this.productImagesRepository.find({ 
      where: { productId: productId },
      order: { sortOrder: 'ASC' } // סידור לפי סדר הצפייה
    });
  }

  // 3. READ ONE
  async findOne(id: number): Promise<ProductImage> {
    const image = await this.productImagesRepository.findOne({ 
      where: { id }
    });
    
    if (!image) {
        throw new NotFoundException(`Product Image with ID ${id} not found`);
    }
    return image;
  }

  // 4. UPDATE (למשל, שינוי סדר הצפייה)
  async update(id: number, updateProductImageDto: UpdateProductImageDto): Promise<ProductImage> {
    const image = await this.findOne(id);
    const updatedImage = this.productImagesRepository.merge(image, updateProductImageDto);
    return this.productImagesRepository.save(updatedImage);
  }

  // 5. DELETE
  async remove(id: number): Promise<void> {
    const result = await this.productImagesRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Product Image with ID ${id} not found`);
    }
  }
}