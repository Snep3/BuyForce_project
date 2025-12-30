import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Comment } from './comment.entity';
import { Category } from '../categories/categories.entity'; 
import { GroupStatus } from '../groups/group.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
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

  /**
   * מחזיר את כל המוצרים עם הקבוצה הפעילה שלהם לדף הבית
   */
  async findAll(): Promise<any[]> {
    const products = await this.productRepo.find({ 
      relations: ['category', 'groups'],
      // וודא שב-product.entity.ts השדה נקרא isActive
      where: { isActive: true } 
    });
    return products.map((product) => this.mapProductForFrontend(product));
  }

  /**
   * מחזיר מוצר בודד עם כל הנתונים הנדרשים לעמוד מוצר
   */
 async findById(id: string): Promise<any> {
  const product = await this.productRepo.findOne({
    where: { id: id as any },
    relations: ['comments', 'category', 'groups'],
  });
  
  if (!product) {
    // זה ידפיס לך בטרמינל של ה-NestJS אזהרה צהובה
    this.logger.warn(`Product with ID ${id} was requested but not found in DB.`);
    throw new NotFoundException(`Product with ID ${id} not found`);
  }
  
  return this.mapProductForFrontend(product);
}

  /**
   * פונקציית עזר למיפוי הנתונים ל-Frontend
   */
  private mapProductForFrontend(product: Product) {
    const activeGroup = product.groups?.find(
      (group) => group.status === GroupStatus.OPEN && group.activeGroup === true
    ) || null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.priceRegular,
      priceGroup: product.priceGroup,
      stock: product.stock,
      category: product.category?.name || 'General',
      comments: product.comments || [],
      active_group: activeGroup ? {
        id: activeGroup.id,
        joined_count: activeGroup.joined_count,
        target_members: activeGroup.target_members,
        progress_pct: activeGroup.progress_pct, 
        deadline: activeGroup.deadline,
        status: activeGroup.status
      } : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async createProduct(data: any): Promise<any> {
    const category = await this.resolveCategory(data.category);
    
    const product = this.productRepo.create({
      ...data,
      category,
      priceRegular: data.price,
    });

    // אנחנו רק מחכים שהשמירה תסתיים. 
    // ה-ID יתעדכן בתוך משתנה ה-product באופן אוטומטי.
    await this.productRepo.save(product as any); 

    // שליחת ה-ID של המשתנה שכבר עודכן
    return this.findById((product as any).id);
  }

  async updateProduct(id: string, patch: any): Promise<any> {
    const product = await this.productRepo.findOne({ where: { id: id as any } });
    if (!product) throw new NotFoundException('Product not found');
    
    Object.assign(product, patch);
    if (patch.category) product.category = await this.resolveCategory(patch.category);
    if (patch.price) product.priceRegular = patch.price;

    await this.productRepo.save(product);
    return this.findById(id);
  }

  async deleteProduct(id: string): Promise<{ deleted: true }> {
    const product = await this.productRepo.findOne({ where: { id: id as any } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepo.remove(product);
    return { deleted: true };
  }

  async addComment(productId: string, userId: string, content: string): Promise<any> {
    const product = await this.productRepo.findOne({ where: { id: productId as any } });
    if (!product) throw new NotFoundException('Product not found');
    
    const comment = this.commentRepo.create({ content, userId, product });
    await this.commentRepo.save(comment);
    return this.findById(productId);
  }
}