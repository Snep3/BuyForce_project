import { IsString, IsNotEmpty, IsNumber, Min, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional() // מאפשר לשדה להיות חסר בבקשה
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number; 

  @IsOptional() // מאפשר לתיאור להיות ריק או חסר
  @IsString()
  description?: string; 
}