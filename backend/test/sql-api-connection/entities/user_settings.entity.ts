// src/entities/user-setting.entity.ts

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './users.entity'; // נדרש לקישור

@Entity('user_settings') // 1. ממופה לטבלת 'user_settings'
export class UserSetting {

  // --- עמודות רגילות ---

  // 2. user_id (PRIMARY KEY ו-FOREIGN KEY, uuid, not null)
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId: string; //

  // 3. push_enabled, email_enabled (boolean, default true)
  @Column({ type: 'boolean', default: true, name: 'push_enabled' })
  pushEnabled: boolean; //
  
  @Column({ type: 'boolean', default: true, name: 'email_enabled' })
  emailEnabled: boolean; //

  // 4. language (character varying(10), default 'en')
  @Column({ type: 'character varying', length: 10, default: 'en' })
  language: string; //
  
  // 5. notification_level (character varying(50), default 'all')
  @Column({ type: 'character varying', length: 50, default: 'all', name: 'notification_level' })
  notificationLevel: string; //

  // 6. created_at, updated_at (timestamp with time zone)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date; //

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date; //
  
  // --- קישור One-to-One (מפתח ראשי משותף) ---
  
  // 7. קישור לטבלת users (fk_user_id)
  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn({ name: 'user_id' }) // הקישור נעשה דרך העמודה user_id
  user: User; // אובייקט המשתמש המלא
}