// src/user_settings/user_settings.entity.ts

import { 
  Entity, PrimaryColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn 
} from 'typeorm';

// ✅ ייבוא ה-Entity המקושר:
import { User } from './users.entity'; // או הנתיב הנכון ל-User Entity

// --- הוספת ה-Enum החסר ---
export enum NotificationLevel { // ✅ תיקון: ייצוא ה-ENUM
    NONE = 'none',
    SUMMARY = 'summary',
    INSTANT = 'instant',
}
// --------------------------

@Entity('user_settings') 
export class UserSetting {

  // 1. userId (PRIMARY KEY + FOREIGN KEY)
  @PrimaryColumn({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string; 
  
  // 2. notification_level (הוספתי רק לצורך הדוגמה לשימוש ב-Enum)
  @Column({ type: 'enum', enum: NotificationLevel, default: NotificationLevel.SUMMARY })
  notificationLevel: NotificationLevel;
  
  // --- קישור One-to-One ---
  @OneToOne(() => User, (user) => user.settings) 
  @JoinColumn({ name: 'user_id' }) // מצביע על העמודה הנוכחית שהיא ה-FK
  user: User; 
  
  // 3. created_at
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date; 

  // 4. updated_at
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}