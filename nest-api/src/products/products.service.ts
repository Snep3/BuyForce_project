// src/products/products.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { Comment } from './comment.entity';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(data: {
    name: string;
    price: number;
    category: string;
    stock?: number;
    description?: string;
  }): Promise<Product> {
    // DTO כבר מוודא כמעט הכל, אבל נשמור guard בסיסי
    if (!data.name || data.price == null || !data.category) {
      throw new BadRequestException('Name, price, and category are required');
    }

    const product = this.productRepo.create({
      name: data.name,
      price: data.price,
      category: data.category,
      stock: data.stock ?? 0,
      description: data.description,
    });

    return this.productRepo.save(product);
  }

  // דוגמה לפונקציה – תחליף את הקיימת אצלך
  async addComment(
    productId: string,
    userId: string,
    content: string,
  ): Promise<Comment> {
    // יוצרים אובייקט Comment עם קשרים לפי ה-Entity
    const comment = this.commentRepo.create({
      content,
      product: { id: productId } as any,
      user: { id: userId } as any,
    });

    return this.commentRepo.save(comment);
  }
  // הוספת תגובה למוצר
  async addCommentToProduct(
    productId: string,
    userId: string,
    dto: AddCommentDto,
  ): Promise<Comment> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentRepo.create({
      content: dto.content,
      product,
      user,
    });

    return this.commentRepo.save(comment);
  }

  // החזרת כל התגובות למוצר
  async getCommentsForProduct(productId: string): Promise<Comment[]> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.commentRepo.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }



  async updateProduct(
    id: string,
    patch: {
      name?: string;
      price?: number;
      category?: string;
      stock?: number;
      description?: string;
    },
  ): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // מעדכנים רק מה שנשלח
    if (patch.name !== undefined) product.name = patch.name;
    if (patch.price !== undefined) product.price = patch.price;
    if (patch.category !== undefined) product.category = patch.category;
    if (patch.stock !== undefined) product.stock = patch.stock;
    if (patch.description !== undefined) product.description = patch.description;

    await this.productRepo.save(product);

    // מחזירים מוצר מעודכן (כולל comments)
    return this.findById(id);
  }

  async deleteProduct(id: string): Promise<{ deleted: true }> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // בגלל onDelete: 'CASCADE' ב-Comment -> יימחקו גם התגובות
    await this.productRepo.remove(product);

    return { deleted: true };
  }

}
