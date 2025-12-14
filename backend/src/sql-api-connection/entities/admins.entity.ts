// src/entities/admins.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer'; // ⬅️ נוסף לייבוא זה!
import { User } from './users.entity';
import { AuditLog } from './audit_logs.entity'; 

@Entity('admins') 
export class Admin {

  // 1. עמודת ID (המפתח הראשי) - UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 2. עמודת user_id (מפתח זר) - UUID
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string; 

  // 3. עמודת role (character varying(50))
  @Column({ type: 'character varying', length: 50, nullable: false })
  role: string;
  
  // 4. עמודת created_at (timestamp without time zone)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  // --- הגדרת הקישור (Foreign Key) ---

  // 5. קישור Many-to-One: אדמין אחד מקושר למשתמש אחד
    @Exclude() // ⬅️ הפתרון: מונע הכללת שדה זה בתגובת ה-JSON.
  @ManyToOne(() => User, user => user.admins, {
        lazy: true // ⬅️ מומלץ: טעינה עצלה כדי לא לטעון את המשתמש אלא אם כן נדרש במפורש
    })
  @JoinColumn({ name: 'user_id' }) 
  user: User;
  
  // קשר OneToMany לאודיט לוגים (אדמין יכול ליצור מספר רשומות audit_logs)
  @OneToMany(() => AuditLog, (auditLog) => auditLog.admin)
  auditLogs: AuditLog[]; 
}