// src/entities/transaction.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './users.entity'; // נדרש לקישור
import { Group } from './groups.entity'; // נדרש לקישור
import { GroupMembership } from './group_memberships.entity'; // נדרש לקישור (Referenced by)

@Entity('transactions') // 1. ממופה לטבלת 'transactions'
export class Transaction {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, not null)
  @PrimaryColumn({ type: 'uuid' }) 
  id: string; //

  // 3. user_id (FOREIGN KEY, uuid)
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string; //

  // 4. group_id (FOREIGN KEY, uuid)
  @Column({ type: 'uuid', name: 'group_id' })
  groupId: string; //

  // 5. amount (numeric(12,2), not null)
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: false })
  amount: number; //

  // 6. currency (character varying(10), not null, default 'ILS')
  @Column({ type: 'character varying', length: 10, nullable: false, default: 'ILS' })
  currency: string; //

  // 7. type, status, provider (character varying(50), not null, עם Check Constraints)
  @Column({ type: 'character varying', length: 50, nullable: false })
  type: string; //
  
  @Column({ type: 'character varying', length: 50, nullable: false })
  status: string; //

  @Column({ type: 'character varying', length: 50, nullable: false, default: 'Tranzilla' })
  provider: string; //

  // 8. provider_ref (character varying(255))
  @Column({ type: 'character varying', length: 255, name: 'provider_ref', nullable: true })
  providerRef: string; //

  // 9. idempotency_key (character varying(255), UNIQUE)
  @Column({ type: 'character varying', length: 255, name: 'idempotency_key', unique: true, nullable: true })
  idempotencyKey: string; //
  
  // 10. error_code (character varying(100))
  @Column({ type: 'character varying', length: 100, name: 'error_code', nullable: true })
  errorCode: string; //

  // 11. error_message (text, nullable)
  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage: string; //

  // 12. created_at, updated_at (timestamp without time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date; //

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
  updatedAt: Date; //
  
  // --- קישורי Many-to-One (המפתחות הזרים) ---
  
  // 13. קישור לטבלת users (transactions_user_id_fkey)
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' }) 
  user: User; // אובייקט המשתמש שביצע את העסקה

  // 14. קישור לטבלת groups (transactions_group_id_fkey)
  @ManyToOne(() => Group, (group) => group.transactions)
  @JoinColumn({ name: 'group_id' }) 
  group: Group; // אובייקט הקבוצה שאליה שייכת העסקה
  
  // --- קישורי One-to-Many (Referenced by) ---
  
  // 15. Referenced by group_memberships (קישור אופציונלי שנוצר ב-GroupMembership)
  @OneToMany(() => GroupMembership, (membership) => membership.transaction)
  groupMemberships: GroupMembership[]; // מערך החברויות המקושרות לעסקה
}