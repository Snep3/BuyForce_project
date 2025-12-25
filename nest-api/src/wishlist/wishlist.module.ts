import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
// ✅ תיקון נתיב: יציאה בודדת (../)
import { Wishlist } from './wishlist.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService], 
})
export class WishlistModule {}