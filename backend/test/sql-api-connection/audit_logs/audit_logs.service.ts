// src/audit_logs/audit_logs.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit_logs.entity'; // 👈 ודא נתיב נכון
import { CreateAuditLogDto } from './dto/create-audit-log.dto'; 

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  // 1. CREATE (כתיבת לוג חדש)
  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const newLog = this.auditLogsRepository.create(createAuditLogDto);
    return this.auditLogsRepository.save(newLog);
  }

  // 2. READ ALL (שליפת כל הלוגים)
  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
        // רלוונטי לטעינת שם האדמין שביצע את הפעולה
        relations: ['admin'] 
    });
  }

  // 3. READ ONE (שליפה לפי ID)
  async findOne(id: string): Promise<AuditLog> {
    // אין צורך ב-NotFoundException אם אין Endpoint ציבורי ללוגים
    return this.auditLogsRepository.findOne({ where: { id } });
  }

  // 🛑 אין פונקציות UPDATE או DELETE
  // ישויות AuditLog אינן ניתנות לעדכון או מחיקה בלוגיקה העסקית.
}