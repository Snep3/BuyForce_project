// src/product_specs/dto/update-product-specs.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSpecDto } from './create-product-specs.dto';
// ✅ אין צורך לייבא ApiProperty, IsString, MaxLength, IsOptional שוב אם הם כבר ב-CreateProductSpecDto

// 1. מרחיב את CreateProductSpecDto והופך את כל השדות לאופציונליים, כולל כל ה-Decorators שלהם.
// זה נותן לך:
// productId?: string;
// specKey?: string;
// specValue?: string;
export class UpdateProductSpecDto extends PartialType(CreateProductSpecDto) {
    // השדות האופציונליים כבר יורשו מ-CreateProductSpecDto
    // אם היית רוצה להוסיף כאן שדה חדש שלא קיים ב-Create, היית מוסיף אותו כאן.
    // מכיוון ש-specValue כבר ירש את ההגדרות שלו, אין צורך להגדיר אותו שוב.
    
    // אם specValue היה השדה היחיד שרצית לאפשר לעדכן:
    /*
    @ApiProperty({ description: 'הערך החדש של המפרט (spec_value)', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly specValue?: string;
    */
}