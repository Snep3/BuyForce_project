import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// כל השדות מ-CreateProductDto הופכים לאופציונליים
export class UpdateProductDto extends PartialType(CreateProductDto) {
    
  // ניתן להוסיף שדות עדכון ספציפיים כאן, למשל שינוי סטטוס
  @ApiProperty({ description: 'סטטוס פעיל/לא פעיל', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean; 
}