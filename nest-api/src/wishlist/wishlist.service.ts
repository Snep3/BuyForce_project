// src/wishlist/wishlist.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepo: Repository<WishlistItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getUserWishlist(userId: string) {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const items = await this.wishlistRepo.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    // מחזיר פורמט פשוט לפרונט
    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: item.product,
    }));
  }

  async add(userId: string, productId: string) {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.wishlistRepo.findOne({
      where: { userId, productId },
    });

    if (existing) {
      return {
        added: false,
        alreadyExists: true,
      };
    }

    const item = this.wishlistRepo.create({
      userId,
      productId,
      product,
    });

    await this.wishlistRepo.save(item);

    return {
      added: true,
      alreadyExists: false,
      id: item.id,
    };
  }

  async remove(userId: string, productId: string) {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    const existing = await this.wishlistRepo.findOne({
      where: { userId, productId },
    });

    if (!existing) {
      // לא זורקים שגיאה כדי שהסרה תהיה idempotent
      return { removed: false };
    }

    await this.wishlistRepo.remove(existing);

    return { removed: true };
  }
}
