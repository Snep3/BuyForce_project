// src/groups/dto/create-group.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

// הגדרת הסטטוסים המותרים כדי למנוע כפילויות ושגיאות כתיב
export enum GroupStatus {
  OPEN = 'OPEN',
  LOCKED = 'LOCKED',
  FAILED = 'FAILED',
}

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  // במקום minParticipants - השתמשנו ב-targetMembers כפי שהגדרנו ב-Entity
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  targetMembers?: number;

  // במקום isActive - השתמשנו ב-activeGroup כפי שביקשת
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  activeGroup?: boolean;

  // הוספת הסטטוס המבוקר (סעיף 3)
  @IsEnum(GroupStatus)
  @IsOptional()
  status?: GroupStatus;

  // מזהה המוצר אליו משויכת הקבוצה
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}