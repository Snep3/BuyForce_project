import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { CreateTransactionDto } from './dto/create-transaction.dto'; 
import { UpdateTransactionDto } from './dto/update-transaction.dto'; 
// ✅ תיקון נתיב: יציאה בודדת (../)
import { Transaction, TransactionStatus } from '../entities/transactions.entity'; 

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  // 1. CREATE: יצירת עסקה חדשה
  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = this.transactionsRepository.create({
        ...createTransactionDto,
        status: TransactionStatus.INITIATED
    }); 
    
    // ✅ שימוש ב-as any כדי לעקוף שגיאות טיפוס TypeORM
    return await this.transactionsRepository.save(newTransaction as any); 
  }

  // 2. READ: שליפת עסקה בודדת
  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({ 
      where: { id } as any 
    });
    
    if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
  
  // 3. UPDATE: עדכון סטטוס
  async updateStatus(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);
    const updatedTransaction = this.transactionsRepository.merge(transaction, updateTransactionDto);
    // ✅ שימוש ב-as any כדי לעקוף שגיאות טיפוס TypeORM
    return await this.transactionsRepository.save(updatedTransaction as any);
  }
}