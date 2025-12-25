// src/sql-api-connection/categories/dto/create-category.dto.ts

import { IsNotEmpty, IsString, Length, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer'; 

export class CreateCategoryDto {
  
  // 1. name - תקין
  @IsNotEmpty() 
  @IsString()
  @Length(1, 100)
  readonly name: string; 
  
  // 2. slug - תקין
  @IsNotEmpty() 
  @IsString() 
  readonly slug: string; 
  
  // 3. iconUrl (שינוי מ-icon_url)
  @IsOptional() 
  @IsString() 
  readonly iconUrl?: string; // 🚨 השם תוקן ל-Camel Case
  
  // 4. sortOrder (שינוי מ-sort_order)
  @IsOptional() 
  @IsInt() 
  @Type(() => Number) 
  readonly sortOrder?: number; // 🚨 השם תוקן ל-Camel Case
}