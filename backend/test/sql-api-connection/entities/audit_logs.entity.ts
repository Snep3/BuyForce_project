// src/entities/audit-log.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Admin } from './admins.entity'; // נדרש לקישור 

@Entity('audit_logs') // ממופה לטבלת 'audit_logs'
export class AuditLog {

  // 1. id (PRIMARY KEY, uuid, not null)
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  // 2. admin_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'admin_id', nullable: false })
  adminId: string; 

  // 3. action (character varying(255), not null)
  @Column({ type: 'character varying', length: 255, nullable: false })
  action: string;
  
  // 4. target_type (character varying(50), not null)
  @Column({ type: 'character varying', length: 50, name: 'target_type', nullable: false })
  targetType: string;

  // 5. target_id (uuid, not null)
  @Column({ type: 'uuid', name: 'target_id', nullable: false })
  targetId: string;
  
  // 6. details (jsonb, nullable)
  @Column({ type: 'jsonb', nullable: true })
  details: any; 
  
  // 7. created_at (timestamp without time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
  
  // --- קישור Many-to-One לטבלת admins (audit_logs_admin_id_fkey) ---
  @ManyToOne(() => Admin, (admin) => admin.auditLogs, { nullable: false })
  @JoinColumn({ name: 'admin_id' }) 
  admin: Admin;
}