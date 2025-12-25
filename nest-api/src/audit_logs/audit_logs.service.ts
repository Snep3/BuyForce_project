// src/audit_logs/audit_logs.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit_logs.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto'; 

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  // 1. CREATE (כתיבת לוג חדש)
  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    
    // **השינוי העיקרי: משתמשים ב-adminId ישירות כחלק מה-newLogData**
    const newLogData = {
        // מפוזרים את שאר הנתונים מה-DTO
        ...createAuditLogDto, 
        // שימוש ישיר ב-adminId, במקום לנסות ליצור אובייקט Admin
        adminId: createAuditLogDto.adminId, 
    };

    // יצירת הרשומה מתוך האובייקט newLogData
    const newLog = this.auditLogsRepository.create(newLogData);
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
  async findOneById(id: string): Promise<AuditLog | null> { 
    return this.auditLogsRepository.findOne({ where: { id } });
  }
}