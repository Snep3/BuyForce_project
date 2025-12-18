// src/sql-api-connection/transactions/dto/create-transaction.dto.ts

import { IsUUID, IsNotEmpty, IsNumber, IsIn, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// ✅ תיקון נתיב: יציאה אחת מספיקה מתיקיית ה-dto/
import { TransactionType } from '../../entities/transactions.entity'; 

export class CreateTransactionDto {
    // ... (שאר הקוד נשאר כפי ששלחת)
  @ApiProperty({ description: 'UUID של המשתמש שיזם את העסקה' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'UUID של הקבוצה שאליה העסקה משויכת' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ description: 'סכום העסקה (numeric(12,2))', example: 99.99 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'סוג העסקה (PREAUTH, CHARGE, REFUND)' })
  @IsIn(Object.values(TransactionType))
  type: TransactionType;
  
  @ApiProperty({ description: 'מפתח Idempotency ייחודי למניעת כפילויות' })
  @IsUUID()
  idempotencyKey: string;
  
  @ApiProperty({ description: 'מזהה ייחודי של הספק' })
  @IsNotEmpty()
  @MaxLength(255)
  providerRef: string;
}