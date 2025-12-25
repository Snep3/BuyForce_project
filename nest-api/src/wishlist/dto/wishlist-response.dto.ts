import { ApiProperty } from '@nestjs/swagger';
import { Wishlist } from '../wishlist.entity'; // ✅ נתיב: יציאה כפולה

export class WishlistResponseDto {
    @ApiProperty({ description: 'UUID של הרשומה ב-Wishlist' })
    id: string;

    @ApiProperty({ description: 'UUID של המשתמש' })
    userId: string;

    @ApiProperty({ description: 'UUID של המוצר' })
    productId: string;

    @ApiProperty({ description: 'תאריך ההוספה לרשימה' })
    createdAt: Date;
    
    // ניתן להוסיף כאן פרטים על המוצר עצמו (כאשר טוענים את הקשר product)
    // @ApiProperty({ type: ProductResponseDto })
    // product: ProductResponseDto; 

    static fromEntity(wishlistItem: Wishlist): WishlistResponseDto {
        const dto = new WishlistResponseDto();
        dto.id = wishlistItem.id;
        dto.userId = wishlistItem.userId;
        dto.productId = wishlistItem.productId;
        dto.createdAt = wishlistItem.createdAt;
        return dto;
    }
}
//שליפה