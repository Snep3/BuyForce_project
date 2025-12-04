// src/categories/dto/update-category.dto.ts

// כל השדות אופציונליים לעדכון
export class UpdateCategoryDto {
  readonly name?: string;
  readonly slug?: string; 
  readonly icon_url?: string; 
  readonly sort_order?: number; 
}