import { IsString, IsIn, IsOptional, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
// ✅ תיקון נתיב: יציאה כפולה (../../)
import { TransactionStatus } from '../../entities/transactions.entity'; 

export class UpdateTransactionDto {
    
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