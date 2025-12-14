import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany 
} from 'typeorm';

// ✅ שינוי 1: וידוא שהייבוא פעיל
import { User } from './users.entity'; 
import { Group } from './groups.entity';
import{ GroupMembership } from './group_memberships.entity'; 

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

  // ✅ שינוי 2: העברתי את userId להערה כדי למנוע התנגשות
  // מכיוון שהקישור (Relation) למטה כבר מנהל את העמודה 'user_id',
  // אנחנו לא יכולים להגדיר אותה פעמיים (גם כ-Column וגם כ-JoinColumn) ללא הגדרות מיוחדות.
  // @Column({ type: 'uuid', name: 'user_id', nullable: false })
  // userId: string;
  
  @Column({ type: 'uuid', name: 'group_id', nullable: false })
  groupId: string; // את זה השארתי כי הקישור ל-Group עדיין בהערה

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
  updatedAt: Date;

  // --- קישורי Many-to-One ---
  
  // ✅ שינוי 3: הסרת ההערות (Uncomment) והפעלת הקישור
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' }) // מגדיר שעמודת ה-FK בטבלה זו היא user_id
  user: User; 

  // שאר הקישורים נשארו בהערה כפי שהיו בקוד המקורי שלך
  @ManyToOne(() => Group, (group) => group.transactions)
  @JoinColumn({ name: 'group_id' }) 
  group: Group; 
  
  @OneToMany(() => GroupMembership, (membership) => membership.transaction)
  groupMemberships: GroupMembership[]; 
}