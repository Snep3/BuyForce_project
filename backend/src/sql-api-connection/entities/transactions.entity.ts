// src/sql-api-connection/entities/transactions.entity.ts

import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany,
  Unique, // 🔑 הוספת ייבוא Unique
  RelationId // 🔑 הוספת ייבוא RelationId
} from 'typeorm';

import { User } from './users.entity'; 
import { Group } from './groups.entity';
import { GroupMembership } from './group_memberships.entity'; 

export enum TransactionType {
  PREAUTH = 'PREAUTH',
  CHARGE = 'CHARGE',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity('transactions')
// 🔑 הוספת ייחודיות למפתח Idempotency
@Unique(['idempotencyKey'])
export class Transaction {

  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  // 🔑 יצירת שדה עבור ה-FK (Foreign Key) של המשתמש בצד ה-Entity
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string;

  @Column({ type: 'uuid', name: 'group_id', nullable: false })
  groupId: string; 

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'character varying', length: 10, nullable: false, default: 'ILS' })
  currency: string;
  
  @Column({ type: 'enum', enum: TransactionType, nullable: false })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, nullable: false, default: TransactionStatus.INITIATED })
  status: TransactionStatus;
  
  @Column({ type: 'character varying', length: 50, nullable: false, default: 'Tranzilla' })
  provider: string;

  @Column({ type: 'character varying', length: 255, name: 'provider_ref', nullable: false })
  providerRef: string;
  
  @Column({ type: 'uuid', name: 'idempotency_key', unique: true, nullable: false }) 
  idempotencyKey: string;

  @Column({ type: 'character varying', length: 100, name: 'error_code', nullable: true })
  errorCode: string;
  
  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' }) // 💡 תיקון: שימוש ב-time zone מומלץ
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' }) // 💡 תיקון: שימוש ב-time zone מומלץ
  updatedAt: Date;

  // --- קישורי Many-to-One ---
  
  // ✅ יחס למשתמש: מקשר לשדה הקיים userId
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' }) // מצביע על העמודה userId שיצרנו למעלה
  user: User; 

  // יחס לקבוצה
  @ManyToOne(() => Group, (group) => group.transactions)
  @JoinColumn({ name: 'group_id' }) 
  group: Group; 
  
  // יחס לחברות בקבוצה
  @OneToMany(() => GroupMembership, (membership) => membership.transaction)
  groupMemberships: GroupMembership[]; 
}