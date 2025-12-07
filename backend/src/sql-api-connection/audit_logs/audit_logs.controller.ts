// src/audit_logs/audit_logs.controller.ts

import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuditLogsService } from './audit_logs.service'; 
import { AuditLog } from '../entities/audit_logs.entity'; 
import { CreateAuditLogDto } from './dto/create-audit-log.dto'; 
import { NotFoundException } from '@nestjs/common';

@Controller('audit-logs') 
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {} 
  
  // POST /audit-logs (כתיבת לוג)
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditLogsService.create(createAuditLogDto);
  }

  // GET /audit-logs (שליפת כל הלוגים)
  @Get()
  findAll(): Promise<AuditLog[]> {
    return this.auditLogsService.findAll();
  }

  // GET /audit-logs/:id
@Get(':id')
async findOneById(@Param('id') id: string): Promise<AuditLog> { 
    const log = await this.auditLogsService.findOneById(id);

    // ✅ אם ה-log הוא null, זרוק שגיאת 404
    if (!log) {
        throw new NotFoundException(`Audit log with ID ${id} not found.`);
    }

    // אם נמצא, החזר את האובייקט (החתימה יכולה להישאר AuditLog)
    return log; 
}
}