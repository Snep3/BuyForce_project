import { IsUUID, IsString, IsNotEmpty, MaxLength, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  
  @ApiProperty({ description: 'שם המוצר', example: 'נעלי ספורט יוקרתיות' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Slug ייחודי לכתובת URL', example: 'sneakers-luxury-black' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  slug: string;

  @ApiProperty({ description: 'מזהה הקטגוריה (ID)', example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  categoryId: number;

  @ApiProperty({ description: 'מחיר רגיל', example: 120.00 })
  @IsNotEmpty()
  @IsNumber()
  priceRegular: number;

  @ApiProperty({ description: 'מחיר קבוצה (מחיר מוזל)', example: 95.50 })
  @IsNotEmpty()
  @IsNumber()
  priceGroup: number;

  @ApiProperty({ description: 'מינימום משתתפים בקבוצה', example: 3 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  minMembers: number;

  @ApiProperty({ description: 'תיאור מלא של המוצר', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'UUID של הספק', required: false })
  @IsOptional()
  @IsUUID()
  supplierId?: string;
  
  @ApiProperty({ description: 'מקסימום משתתפים בקבוצה', required: false })
  @IsOptional()
  @IsNumber()
  maxMembers?: number;
    @IsOptional()
  @IsString()
  currency?: string;  // ⬅️ תוסיף

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // ⬅️ תוסיף

}