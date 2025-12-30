// src/sql-api-connection/categories/dto/update-category.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
// ודא שאתה מייבא רק את מה שצריך אם אתה מוסיף שדות
// לדוגמה: import { IsOptional, IsBoolean } from 'class-validator';

// המחלקה מרחיבה את CreateCategoryDto והופכת את כל השדות לאופציונליים
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  
  // אם תרצה להוסיף שדה חדש שקיים רק בעדכון (לדוגמה, isHidden), 
  // תוכל להגדיר אותו כאן עם IsOptional:
  
  /*
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean; 
  */
}