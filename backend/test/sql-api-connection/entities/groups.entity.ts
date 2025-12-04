// src/entities/group.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from './products.entity'; // נדרש לקישור (product_id)
import { GroupMembership } from './group_memberships.entity'; // נדרש לקישור (Referenced by)
import { Transaction } from './transactions.entity'; // נדרש לקישור (Referenced by)

@Entity('groups') // 1. ממופה לטבלת 'groups'
export class Group {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, not null)
  @PrimaryColumn({ type: 'uuid' }) 
  id: string; //

  // 3. product_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'product_id', nullable: false })
  productId: string; //

  // 4. status (character varying(50), not null)
  @Column({ type: 'character varying', length: 50, nullable: false })
  status: string; //
  
  // 5. joined_count, target_members, max_members (integer, not null)
  @Column({ type: 'integer', nullable: false, default: 0, name: 'joined_count' })
  joinedCount: number; //

  @Column({ type: 'integer', nullable: false, name: 'target_members' })
  targetMembers: number; //

  @Column({ type: 'integer', nullable: false, name: 'max_members' })
  maxMembers: number; //

  // 6. deadline, reached_target_at, locked_at, changed_at, failed_at (timestamp with time zone, not null/nullable)
  @Column({ type: 'timestamp with time zone', nullable: false })
  deadline: Date; //

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'reached_target_at' })
  reachedTargetAt: Date; //

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'locked_at' })
  lockedAt: Date; //

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'changed_at' })
  changedAt: Date; //

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'failed_at' })
  failedAt: Date; //
  
  // 7. created_at (timestamp without time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date; //

  // 8. updated_at (timestamp without time zone, default now())
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
  updatedAt: Date; //
  
  // --- קישורי Many-to-One (המפתח הזר) ---
  
  // 9. קישור לטבלת products (groups_product_id_fkey)
  @ManyToOne(() => Product, (product) => product.groups)
  @JoinColumn({ name: 'product_id' }) 
  product: Product; // אובייקט המוצר המלא שאליו קשורה הקבוצה

  // --- קישורי One-to-Many (Referenced by) ---
  
  // 10. קישור לטבלת group_memberships (group_memberships_group_id_fkey)
  @OneToMany(() => GroupMembership, (membership) => membership.group)
  memberships: GroupMembership[]; // מערך חברי הקבוצה
  
  // 11. קישור לטבלת transactions (transactions_group_id_fkey)
  @OneToMany(() => Transaction, (transaction) => transaction.group)
  transactions: Transaction[]; // מערך העסקאות הקשורות לקבוצה
}