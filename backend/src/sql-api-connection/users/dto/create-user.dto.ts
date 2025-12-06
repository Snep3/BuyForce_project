import { IsEmail, IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  
  @ApiProperty({ description: 'כתובת דוא"ל ייחודית' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: 'סיסמה גלויה של המשתמש' })
  @IsString()
  @MinLength(8) // דרישת מינימום
  password: string;

  @ApiProperty({ description: 'שם מלא של המשתמש', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string; 
  
  // שיכולים להיות מוגדרים ע"י קריאת API ראשונית או ברירת מחדל
  @ApiProperty({ description: 'שפת הממשק (כמו en, he)', default: 'en', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;
}