// src/entities/group-membership.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Group } from './groups.entity';
import { User } from './users.entity';
import { Transaction } from './transactions.entity';

@Entity('group_memberships') // 1. ממופה לטבלת 'group_memberships'.
export class GroupMembership {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, not null)
  @PrimaryColumn({ type: 'uuid' }) 
  id: string; //

  // 3. group_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'group_id', nullable: false })
  groupId: string; //

  // 4. user_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string; //
  
  // 5. status (character varying(50), not null)
  @Column({ type: 'character varying', length: 50, nullable: false })
  status: string; //

  // 6. joined_at (timestamp with time zone, default now())
  @CreateDateColumn({ name: 'joined_at', type: 'timestamp with time zone' })
  joinedAt: Date; //

  // 7. cancelled_at (timestamp with time zone, nullable)
  @Column({ type: 'timestamp with time zone', nullable: true, name: 'cancelled_at' })
  cancelledAt: Date; //

  // 8. changed_at, refunded_at, transaction_id (דומים, מופרטים בקוד המלא)
  // ...

  // 9. amount_group_price (numeric(12,2), not null)
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: false, name: 'amount_group_price' })
  amountGroupPrice: number; //
  
  // --- קישורי Many-to-One (המפתחות הזרים) ---
  
  // 10. קישור לטבלת groups (group_memberships_group_id_fkey)
  @ManyToOne(() => Group, (group) => group.memberships) // רבים (חברות) לאחד (קבוצה)
  @JoinColumn({ name: 'group_id' }) // מצביע על העמודה ב-DB המשמשת כמפתח זר
  group: Group; // אובייקט ה-Group המלא
  
  // 11. קישור לטבלת users (group_memberships_user_id_fkey)
  @ManyToOne(() => User, (user) => user.groupMemberships) // רבים (חברות) לאחד (משתמש)
  @JoinColumn({ name: 'user_id' })
  user: User; // אובייקט ה-User המלא
  
  // 12. קישור לטבלת transactions
  @ManyToOne(() => Transaction, (transaction) => transaction.groupMemberships)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction; // אובייקט ה-Transaction המקושר
}