// src/audit_logs/audit_logs.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit_logs.entity'; 
import { AuditLogsService } from './audit_logs.service';
import { AuditLogsController } from './audit_logs.controller'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]) 
  ],
  providers: [AuditLogsService],
  controllers: [AuditLogsController],
  // 🔑 חשיבות: ניתן לייצא את Service זה כדי ש-Services אחרים יוכלו לכתוב לוגים:
  exports: [AuditLogsService], 
})
export class AuditLogsModule {}