// src/product-performance/dto/product-performance.dto.ts
import { IsUUID, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class ProductPerformanceDto {
  // המזהה הראשי והמפתח הזר - נדרש תמיד
  @IsUUID()
 readonly product_id: string;

  // נתונים אופציונליים לעדכון, עם וולידציה
  @IsOptional()
  @IsInt()
  @Min(0)
 readonly views_7d?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
 readonly joins_7d?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly wishlist_adds_7d?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }) // מקסימום שתי ספרות אחרי הנקודה
  @Min(0)
  readonly conversion_rate?: number;
}