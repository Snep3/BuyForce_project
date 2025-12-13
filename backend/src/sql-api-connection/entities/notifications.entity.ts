// src/entities/notification.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'; 
import { User } from './users.entity'; 

@Entity('notifications') // 1. ממופה לטבלת 'notifications'
export class Notification {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, not null)
  // 🛑 התיקון: שינוי ל-PrimaryGeneratedColumn כדי שה-DB ייצור את ה-UUID
  @PrimaryGeneratedColumn('uuid') 
  id: string; //

  // 3. user_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string; //

  // ... שאר העמודות נשארות כפי שהן ...
  @Column({ type: 'character varying', length: 50, nullable: false })
  type: string; //

  @Column({ type: 'character varying', length: 255, nullable: false })
  title: string; //
  
  @Column({ type: 'text', nullable: false })
  body: string; //
  
  @Column({ type: 'jsonb', nullable: true })
  payload: any; //

  @Column({ type: 'character varying', length: 50, nullable: false })
  channel: string; //

  @Column({ type: 'character varying', length: 50, nullable: false })
  status: string; //

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string; //

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date; //

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'sent_at' })
  sentAt: Date; //
  
  // --- קישור Many-to-One (המפתח הזר) ---
  
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' }) 
  user: User; // אובייקט המשתמש המלא שאליו נשלחה ההודעה
}