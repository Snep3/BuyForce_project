import { IsUUID, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSpecDto {
  
  @ApiProperty({ 
    description: 'UUID של המוצר שאליו מקושר המפרט', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsUUID()
  productId: string;

  @ApiProperty({ 
    description: 'המפתח של המפרט (spec_key). לדוגמה: "צבע", "חומר"', 
    example: 'Color' 
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255) // בהתאם למגבלת character varying(255) בטבלה
  specKey: string;

  @ApiProperty({ 
    description: 'הערך של המפרט (spec_value). לדוגמה: "שחור", "פלסטיק"', 
    example: 'Black' 
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255) // בהתאם למגבלת character varying(255) בטבלה
  specValue: string;
}