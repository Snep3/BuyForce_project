// src/groups/dto/update-group.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsOptional, IsInt, IsDateString, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// אופציה 1: להשתמש ב-PartialType (הדרך הנכונה ב-NestJS)
// אם אתה משתמש ב-PartialType מ-@nestjs/mapped-types, אין צורך להגדיר שוב כל שדה
// הוא לוקח את כל השדות מ-CreateGroupDto והופך אותם ל-Optional.

/*
export class UpdateGroupDto extends PartialType(CreateGroupDto) {} 
// אם אתה משתמש בזה, ודא ש-CreateGroupDto משתמש ב-Camel Case
// ו-id ו-productId צריכים להיות מוסרים מ-PartialType כי לא משנים אותם בדרך כלל
*/

// אופציה 2: הגדרה ידנית (כפי שהתחלת) - תוך שימוש ב-Camel Case

export class UpdateGroupDto {
  @IsOptional()
  @IsIn(['OPEN', 'REACHED_TARGET', 'LOCKED', 'CHARGED', 'FAILED', 'REFUNDED'])
  @IsString()
  readonly status?: string; 
  
  @IsOptional()
  @IsDateString()
  readonly deadline?: Date; 
  
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  // 🛑 שימוש ב-Camel Case עבור המשתנה ב-Node/NestJS
  readonly targetMembers?: number; // ✅ תוקן ל-Camel Case

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  // שדה זה הוא גם חובה ב-DB בדרך כלל, לכן נגדיר אותו
  readonly maxMembers?: number; // ✅ תוקן ל-Camel Case
  
  // שדות עדכון לוגיסטיים, לדוגמה:
  @IsOptional()
  @IsDateString()
  readonly reachedTargetAt?: Date; // ✅ תוקן ל-Camel Case

  @IsOptional()
  @IsDateString()
  readonly lockedAt?: Date; // ✅ תוקן ל-Camel Case
}