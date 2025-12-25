// src/product_images/dto/product-image.dto.ts

import { Expose } from 'class-transformer';

/**
 * DTO להצגת תמונת מוצר בודדת (משמש גם לכרטיס וגם לעמוד מוצר)
 */
export class ProductImageDto {
    @Expose()
    id: number;

    @Expose()
    imageUrl: string;

    @Expose()
    sortOrder: number;

    // @Expose()
    // isPrimary: boolean; // אופציונלי, אם מוסיפים שדה זה ל-Entity
}