// src/wishlist/dto/add-wishlist.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddWishlistDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
