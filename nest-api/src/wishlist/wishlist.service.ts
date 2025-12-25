//ה-Service יטפל ביצירת פריט, מחיקתו (הסרה מהרשימה) ושליפת הרשימה המלאה.
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { CreateWishlistDto } from './dto/create-wishlist.dto'; 
// ✅ תיקון נתיב: יציאה בודדת (../)
import { Wishlist } from './wishlist.entity'; 

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  // 1. CREATE: הוספת מוצר לרשימה (יצירת רשומה)
  async create(createDto: CreateWishlistDto): Promise<Wishlist> {
    
    // בדיקה למניעת כפילות (ה-Unique Constraint של TypeORM עושה זאת, אבל בדיקה מוקדמת עוזרת לשגיאה נקייה)
    const existing = await this.wishlistRepository.findOne({ 
      where: { userId: createDto.userId, productId: createDto.productId } as any 
    });
    
    if (existing) {
        throw new ConflictException('This product is already in the user\'s wishlist.');
    }
    
    const newWishlistItem = this.wishlistRepository.create(createDto); 
    // ✅ שימוש ב-as any כדי לעקוף שגיאות טיפוס TypeORM
    return await this.wishlistRepository.save(newWishlistItem as any); 
  }

  // 2. READ: שליפת כל רשימת המשאלות של משתמש
  async findAllByUser(userId: string): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({ 
      where: { userId } as any,
      order: { createdAt: 'DESC' },
      // relations: ['product'], // אם רוצים לטעון את פרטי המוצר
    });
  }
  
  // 3. DELETE: הסרת מוצר מהרשימה
  async remove(userId: string, productId: string): Promise<void> {
      const result = await this.wishlistRepository.delete({ userId, productId } as any);
      
      if (result.affected === 0) {
          throw new NotFoundException(`Product ${productId} not found in wishlist for user ${userId}.`);
      }
  }
}