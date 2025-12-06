import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { CreateProductDto } from './dto/create-product.dto'; 
import { UpdateProductDto } from './dto/update-product.dto'; 
import { Product } from '../entities/products.entity'; 

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // 1. CREATE
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // השתמש ב-Type Assertion אם שגיאת TS2769 חוזרת
    const newProduct = this.productsRepository.create(createProductDto); 
    return await this.productsRepository.save(newProduct); 
  }

  // 2. READ ALL (שליפת מוצרים פעילים)
  async findAllActive(): Promise<Product[]> {
    // **תיקון: שימוש ב-Query Builder כדי לעקוף את שגיאת ה-where**
    return await this.productsRepository.createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true }) // שאילתה על שדה isActive
      .andWhere('product.deletedAt IS NULL') // שאילתה על שדה deletedAt IS NULL
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  // 3. READ ONE
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ 
      // חזרה לשיטה הרגילה, מכיוון שהיא פשוטה יותר
      where: { id, deletedAt: null, isActive: true } as any
    });
    
    if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // 4. UPDATE
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const updatedProduct = this.productsRepository.merge(product, updateProductDto);
    return await this.productsRepository.save(updatedProduct);
  }

  // 5. DELETE (מחיקה רכה)
  async remove(id: string): Promise<void> {
    // מכיוון שאין @DeleteDateColumn, נבצע עדכון ידני:
    const updateResult = await this.productsRepository.update(
        { id: id as any }, 
        { deletedAt: new Date() } as any
    );
    
    if (updateResult.affected === 0) {
        throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}