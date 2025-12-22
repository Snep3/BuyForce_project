import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from '../transactions/transactions.entity';
import { GroupMembership } from '../group_memberships/group_memberships.entity';
import { Product } from '../products/product.entity'; // תיקון נתיב הייבוא

// 1. הגדרת רשימת הסטטוסים האפשריים
export enum GroupStatus {
  OPEN = 'OPEN',
  LOCKED = 'LOCKED',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED'
}
@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // השדות שביקשת להוסיף עבור ה-Seed:
  @Column({ name: 'status', type: 'character varying', length: 20, default: 'OPEN' })
  status: string;

  @Column({ name: 'joined_count', type: 'integer', default: 0 })
  joinedCount: number;

  @Column({ name: 'target_members', type: 'integer', default: 1 })
  targetMembers: number;

  @Column({ name: 'active_group', type: 'boolean', default: true })
  activeGroup: boolean;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  // --- יחסים (Relations) ---

  @ManyToOne(() => Product, (product) => product.groups)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => Transaction, (transaction) => transaction.group)
  transactions: Transaction[]; 

  @OneToMany(() => GroupMembership, (membership) => membership.group)
  memberships: GroupMembership[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}