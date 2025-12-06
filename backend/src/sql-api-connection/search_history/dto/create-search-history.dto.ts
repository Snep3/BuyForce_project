import { IsUUID, IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSearchHistoryDto {
  
  @ApiProperty({ description: 'UUID של המשתמש שביצע את החיפוש' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'מילת המפתח שחופשה' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  keyword: string;
  
  // אין שדות לעדכון או מחיקה מכיוון שזו טבלת לוגים.
}