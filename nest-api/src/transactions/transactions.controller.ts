// src/sql-api-connection/transactions/transactions.controller.ts

import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
// ✅ ייבוא DTO קורא + ApiTags
import { TransactionDto } from '../transactions/dto/transaction.dto'; 
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
// 🔑 הוספת Interceptor להמרת Entity ל-DTO
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    // ----------------------------------------------------------------------
    // 🆕 1. GET /transactions (שליפת כל העסקאות - Admin)
    // ----------------------------------------------------------------------
    @Get()
    @ApiOperation({ summary: 'שליפת כל העסקאות במערכת (מנהלים)' })
    findAll() {
        // מחזיר TransactionDto[]
        return this.transactionsService.findAll();
    }

    // ----------------------------------------------------------------------
    // 🆕 2. GET /transactions/user/:userId (שליפת עסקאות לפי משתמש)
    // ----------------------------------------------------------------------
    @Get('user/:userId')
    @ApiOperation({ summary: 'שליפת כל העסקאות עבור משתמש ספציפי' })
    findByUserId(@Param('userId') userId: string) {
        // מחזיר TransactionDto[]
        return this.transactionsService.findByUserId(userId);
    }
    
    // ----------------------------------------------------------------------
    // 3. ה-GET הקיים: GET /transactions/:id
    // ----------------------------------------------------------------------
    @Get(':id')
    @ApiOperation({ summary: 'שליפת עסקה לפי ID' })
    // ✅ תיקון: שינוי findOneorfail ל-findOneOrFail כדי להיות עקבי עם ה-Service
    findOneOrFail(@Param('id') id: string): Promise<TransactionDto> {
        // מחזיר TransactionDto לאחר המרה אוטומטית על ידי Interceptor
        return this.transactionsService.findOneOrFail(id) as unknown as Promise<TransactionDto>;
    }
    
    // ----------------------------------------------------------------------
    // 4. POST /transactions
    // ----------------------------------------------------------------------
    @Post()
    @ApiOperation({ summary: 'יצירת עסקה חדשה (סטטוס התחלתי: INITIATED)' })
    create(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionsService.create(createTransactionDto);
    }

    // ----------------------------------------------------------------------
    // 5. PATCH /transactions/:id/status
    // ----------------------------------------------------------------------
    @Patch(':id/status')
    @ApiOperation({ summary: 'עדכון סטטוס עסקה לאחר אישור/כישלון מהספק' })
    updateStatus(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
        return this.transactionsService.updateStatus(id, updateTransactionDto);
    }
}