import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSpecDto } from './create-product-specs.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

// 1. מרחיב את CreateProductSpecDto והופך את כל השדות לאופציונליים
export class UpdateProductSpecDto extends PartialType(CreateProductSpecDto) {
  // 2. חריגה: בדרך כלל, אין לאפשר עדכון של מפתחות ראשיים/זרים בעדכון:
  // @Exclude()
  // productId: string;
  
  // 3. אנו נאפשר רק עדכון של specValue. כל השאר יהיו אופציונליים (דרך PartialType)
  
  @ApiProperty({ description: 'הערך החדש של המפרט (spec_value)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  specValue?: string;
  
  // כדי למנוע שינוי של המפתחות, נסיר אותם או נשים אותם ב-@Exclude אם יש לך את ספריית class-transformer.
}