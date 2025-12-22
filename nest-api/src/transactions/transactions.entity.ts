import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany,
} from 'typeorm';

import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { GroupMembership } from '../group_memberships/group_memberships.entity';

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
export class Transaction {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'character varying', length: 10, nullable: false, default: 'ILS' })
  currency: string;
  
  @Column({ type: 'enum', enum: TransactionType, nullable: false })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, nullable: false, default: TransactionStatus.INITIATED })
  status: TransactionStatus;
  
  @Column({ type: 'character varying', length: 50, nullable: false, default: 'stripe' })
  provider: string;

  @Column({ type: 'character varying', length: 255, name: 'provider_ref', nullable: false })
  providerRef: string;
  
  // הגדרת ה-Unique כאן מספיקה, אין צורך ב-Decorator מעל ה-Class
  @Column({ type: 'uuid', name: 'idempotency_key', unique: true, nullable: false }) 
  idempotencyKey: string;

  @Column({ type: 'character varying', length: 100, name: 'error_code', nullable: true })
  errorCode: string;
  
  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // --- יחסים (Relations) ---
  
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' }) // זה יוצר את עמודת user_id באופן אוטומטי
  user: User; 

  @ManyToOne(() => Group, (group) => group.transactions)
  @JoinColumn({ name: 'group_id' }) // זה יוצר את עמודת group_id באופן אוטומטי
  group: Group; 
  
  @OneToMany(() => GroupMembership, (membership) => membership.transaction)
  groupMemberships: GroupMembership[]; 
}