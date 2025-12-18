// src/sql-api-connection/transactions/transactions.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
// ✅ תיקון נתיב הייבוא (נניח שהוא נמצא בתיקייה dto/ עם שם הקובץ transaction.dto.ts)
import { TransactionDto } from '../transactions/dto/transaction.dto'; 

import { Transaction, TransactionStatus } from '../entities/transactions.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private transactionsRepository: Repository<Transaction>,
    ) {}

    // ----------------------------------------------------------------------
    // 1. CREATE: יצירת עסקה חדשה
    // ----------------------------------------------------------------------
    async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const newTransaction = this.transactionsRepository.create({
            ...createTransactionDto,
            status: TransactionStatus.INITIATED
        });

        return await this.transactionsRepository.save(newTransaction as any);
    }

    // ----------------------------------------------------------------------
    // 2. READ: שליפת עסקאות - חדש!
    // ----------------------------------------------------------------------

    // 2.1. שליפת כל העסקאות (לשימוש Admin)
    async findAll(): Promise<TransactionDto[]> {
        const transactions = await this.transactionsRepository.find({
            // ניתן להוסיף relations כמו 'user' אם קיימים
            order: { createdAt: 'DESC' }, 
        });
        // 🔑 המרה ל-DTO
        return plainToInstance(TransactionDto, transactions, { excludeExtraneousValues: true });
    }

    // 2.2. שליפת עסקאות לפי משתמש (לשימוש Frontend)
    async findByUserId(userId: string): Promise<TransactionDto[]> {
        const transactions = await this.transactionsRepository.find({
            where: { 
                // 💡 הנחה שהיחס נקרא 'user' ב-Entity שלך
                user: { id: userId } 
            } as any, // ⚠️ נדרש 'as any' ל-where כשמשתמשים ביחסים ב-TypeORM
            order: { createdAt: 'DESC' },
            // אופציונלי: relations: ['user', 'product'], 
        });

        return plainToInstance(TransactionDto, transactions, { excludeExtraneousValues: true });
    }

    // 2.3. שליפת עסקה בודדת + זריקת שגיאה (findOneOrFail)
    async findOneOrFail(id: string): Promise<Transaction> {
        const transaction = await this.transactionsRepository.findOne({ 
            where: { id } as any 
        });

        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${id} not found`);
        }
        return transaction;
    }

    // ----------------------------------------------------------------------
    // 3. UPDATE: עדכון סטטוס
    // ----------------------------------------------------------------------
    async updateStatus(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
        // 💡 שימוש בפונקציה findOneOrFail המעודכנת
        const transaction = await this.findOneOrFail(id);
        const updatedTransaction = this.transactionsRepository.merge(transaction, updateTransactionDto);

        return await this.transactionsRepository.save(updatedTransaction as any);
    }
}