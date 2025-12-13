// src/sql-api-connection/users/dto/create-user.dto.ts

import { IsEmail, IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  
  // ⬅️ שדה ID הוסר כיוון ש-@PrimaryGeneratedColumn מייצר אותו אוטומטית.

  @ApiProperty({ description: 'כתובת דוא"ל ייחודית' })
  @IsEmail()
  @MaxLength(255)
  @Type(() => String)
  email: string;

  @ApiProperty({ description: 'סיסמה גלויה של המשתמש' })
  @IsString()
  @MinLength(8) 
  @Type(() => String)
  password: string;

  @ApiProperty({ description: 'שם מלא של המשתמש', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Type(() => String)
  fullName?: string; 
  
  @ApiProperty({ description: 'שפת הממשק (כמו en, he)', default: 'en', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Type(() => String)
  locale?: string;
}