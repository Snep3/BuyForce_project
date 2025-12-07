// src/categories/dto/create-category.dto.ts

export class CreateCategoryDto {
  // @IsNotEmpty()
  // @Length(1, 100)
  readonly name: string; 
  
  // @IsNotEmpty()
  readonly slug: string; 
  
  // @IsOptional()
  readonly icon_url?: string; 
  
  // @IsInt()
  readonly sort_order?: number; 
}