import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Comment } from './comment.entity';
import { Category } from '../categories/categories.entity'; 

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  private async resolveCategory(categoryInput: any): Promise<Category> {
    const categoryId = Number(categoryInput);
    if (!isNaN(categoryId)) {
      const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
      if (category) return category;
    }
    const categoryByName = await this.categoryRepo.findOne({ 
      where: { name: String(categoryInput) } 
    });
    if (categoryByName) return categoryByName;
    throw new NotFoundException(`Category '${categoryInput}' not found.`);
  }

  async findAll(): Promise<any[]> {
    const products = await this.productRepo.find({ relations: ['category'] });
    return products.map((product) => this.mapProductForFrontend(product));
  }

  async findById(id: string): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { id: id as any },
      relations: ['comments', 'category'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.mapProductForFrontend(product);
  }

  async createProduct(data: {
    name: string;
    price: number;
    category: string;
    stock?: number;
    description?: string;
  }): Promise<any> {
    // רק שמות, מחיר וקטגוריה הם חובה
    if (!data.name || data.price == null || !data.category) {
      throw new BadRequestException('Required fields missing');
    }

    const category = await this.resolveCategory(data.category);

    const product = this.productRepo.create({
      name: data.name,
      priceRegular: data.price,
      category: category,
      // וידוא ערכי ברירת מחדל: 0 למלאי ומחרוזת ריקה לתיאור
      stock: (data.stock !== undefined && data.stock !== null) ? data.stock : 0,
      description: data.description ?? '', 
    });

    const savedProduct = await this.productRepo.save(product);
    return this.mapProductForFrontend(savedProduct);
  }

  async updateProduct(id: string, patch: any): Promise<any> {
    const product = await this.productRepo.findOne({ 
      where: { id: id as any },
      relations: ['category']
    });
    if (!product) throw new NotFoundException('Product not found');

    if (patch.name !== undefined) product.name = patch.name;
    if (patch.price !== undefined) product.priceRegular = patch.price;
    if (patch.category !== undefined) product.category = await this.resolveCategory(patch.category);
    
    // מאפשר לעדכן ל-0 או למחרוזת ריקה
    if (patch.stock !== undefined) product.stock = patch.stock ?? 0;
    if (patch.description !== undefined) product.description = patch.description ?? '';

    const updated = await this.productRepo.save(product);
    return this.mapProductForFrontend(updated);
  }

  async addComment(productId: string, userId: string, content: string): Promise<any> {
    if (!content || !content.trim()) throw new BadRequestException('Comment content required');
    const product = await this.productRepo.findOne({ where: { id: productId as any } });
    if (!product) throw new NotFoundException('Product not found');

    const comment = this.commentRepo.create({ content: content.trim(), userId, product });
    await this.commentRepo.save(comment);
    return this.findById(productId);
  }

  async deleteProduct(id: string): Promise<{ deleted: true }> {
    const product = await this.productRepo.findOne({ where: { id: id as any } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepo.remove(product);
    return { deleted: true };
  }

  private mapProductForFrontend(product: Product) {
    return {
      ...product,
      price: product.priceRegular,
      category: product.category?.name || 'General',
    };
  }
}