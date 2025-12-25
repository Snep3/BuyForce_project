// src/groups/dto/create-group.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDateString } from 'class-validator';

// הגדרת הסטטוסים המותרים - תיקון שגיאת הכתיב
export enum GroupStatus {
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED', // תוקן מ-COPMLETED
  FAILED = 'FAILED',
}

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  targetMembers?: number;

  @IsNumber()
  @IsNotEmpty()
  target_members: number; 

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  activeGroup?: boolean;

  // הוספת השדה בפורמט שנשלח מה-Frontend כדי למנוע שגיאת 400
  @IsBoolean()
  @IsOptional()
  active_group?: boolean; 

  @IsEnum(GroupStatus)
  @IsOptional()
  status?: GroupStatus;

  // שינוי מ-IsUUID ל-IsString כדי להיות גמישים יותר עם מזהי המוצרים
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsNumber()
  joined_count: number;

  @IsDateString() 
  @IsOptional()
  deadline?: Date;
}