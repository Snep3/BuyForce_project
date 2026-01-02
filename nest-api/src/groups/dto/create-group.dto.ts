// src/groups/dto/create-group.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean, IsEnum, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDateString } from 'class-validator';

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

  @IsOptional()
@IsNumber()
joined_count: number;


  @IsNumber()
  @IsNotEmpty()
  target_members: number; // חובה לקבוע יעד כשיוצרים קבוצה

@IsDateString() // וולידציה שהתאריך נשלח בפורמט תקין (ISO)
@IsOptional()
deadline?: Date;
// הוסף את השורות האלו בתוך הקלאס CreateGroupDto
@IsOptional()
@IsString({ each: true }) // מוודא שזה מערך של מחרוזות
productIds?: string[];

}

