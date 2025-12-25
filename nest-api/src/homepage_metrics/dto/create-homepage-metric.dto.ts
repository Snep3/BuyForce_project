// src/homepage_metrics/dto/create-homepage-metric.dto.ts

import { IsInt, IsDateString, IsNumber, IsNotEmpty } from 'class-validator'; // ✅ שינוי: IsNumberString הוחלף ב-IsNumber
import { Type } from 'class-transformer'; 

export class CreateHomepageMetricDto {
  // 1. category_id
  @IsNotEmpty()
  @IsInt() 
  @Type(() => Number) // מומלץ לוודא המרה גם עבור מפתח זר
  category_id: number; 

  // 2. week_start
  @IsDateString()
  week_start: string; 

  // 3. joins_count
  @IsInt()
  @Type(() => Number) // ✅ משאיר ומבטיח המרה ל-Number לפני ה-IsInt
  joins_count: number;

  // 4. gmv
  @IsNumber() // ✅ תיקון: משתמשים ב-@IsNumber כי זה ערך עשרוני
  @Type(() => Number) // ✅ חיוני: ממיר את ה-gmv לטיפוס Number
  gmv: number;
}