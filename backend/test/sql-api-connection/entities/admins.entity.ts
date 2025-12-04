// src/entities/admin.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './users.entity';
import { AuditLog } from './audit_logs.entity';
@Entity('admins') // 💡 שם הטבלה כפי שהוא ב-PostgreSQL
export class Admin {

  // 1. עמודת ID (המפתח הראשי) - UUID
  // TypeORM משתמש ב-PrimaryColumn עבור מפתחות ראשיים שאינם נוצרים אוטומטית כ-serial
  @PrimaryColumn({ type: 'uuid' })
  id: string; // TypeORM ממפה UUID למחרוזת ב-TypeScript

  // 2. עמודת user_id (מפתח זר) - UUID
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string; 

  // 3. עמודת role (character varying(50))
  @Column({ type: 'character varying', length: 50, nullable: false })
  role: string;
  
  // 4. עמודת created_at (timestamp without time zone)
  // TypeORM מציע דרך נקייה להגדרת עמודת יצירה עם ערך ברירת מחדל 'now()'
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  // --- הגדרת הקישור (Foreign Key) ---

  // 5. קישור Many-to-One: אדמין אחד מקושר למשתמש אחד
  // הטבלה שלך מראה: FOREIGN KEY (user_id) REFERENCES users(id)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // מציין ש-TypeORM צריך להשתמש בעמודה user_id כמפתח זר
  user: User;
  
  // קשר OneToMany לאודיט לוגים (אדמין יכול ליצור מספר רשומות audit_logs)
  @OneToMany(() => AuditLog, (auditLog) => auditLog.admin)
  auditLogs: AuditLog[];
  
}
