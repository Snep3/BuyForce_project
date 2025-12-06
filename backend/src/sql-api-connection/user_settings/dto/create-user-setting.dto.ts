import { IsUUID, IsBoolean, IsString, IsIn, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationLevel } from '../../entities/user_settings.entity'; // ✅ נתיב: יציאה כפולה

export class CreateUserSettingDto {
  
  @ApiProperty({ description: 'UUID של המשתמש' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'האם התראות Push מופעלות', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiProperty({ description: 'האם התראות דוא"ל מופעלות', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiProperty({ description: 'שפת ממשק המשתמש (לדוגמה: en, he)', default: 'en', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;
  
  @ApiProperty({ description: 'רמת ההתראות (all, important, none)', default: 'all', required: false })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(NotificationLevel))
  notificationLevel?: NotificationLevel;
}