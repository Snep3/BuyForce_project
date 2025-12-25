// src/sql-api-connection/transactions/dto/update-transaction.dto.ts

import { IsString, IsIn, IsOptional, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
// ✅ תיקון נתיב: יציאה אחת מספיקה מתיקיית ה-dto/
import { TransactionStatus } from '../transactions.entity'; 

export class UpdateTransactionDto {
    // ... (שאר הקוד נשאר כפי ששלחת)
  @IsOptional()
  @IsIn([TransactionStatus.SUCCESS, TransactionStatus.FAILED]) 
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  errorCode?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}