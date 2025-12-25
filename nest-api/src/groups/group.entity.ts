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
import {Expose} from 'class-transformer';
import { Transaction } from '../transactions/transactions.entity';
import { GroupMembership } from '../group_memberships/group_memberships.entity';
import { Product } from '../products/product.entity'; // תיקון נתיב הייבוא

// 1. הגדרת רשימת הסטטוסים האפשריים
export enum GroupStatus {
  OPEN = 'OPEN',
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

  @Column({ name: 'active_group', type: 'boolean', default: true })
  activeGroup: boolean;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;
// src/groups/group.entity.ts

@Column({ type: 'int', default: 0 })
joined_count: number;

@Column({ type: 'int', default: 10 }) // ברירת מחדל של 10 משתתפים
target_members: number;

@Column({ type: 'timestamp', nullable: true })
deadline: Date;

@Expose()
  get progress_pct(): number {
    if (!this.target_members || this.target_members === 0) return 0;
    
    const percentage = (this.joined_count / this.target_members) * 100;
    
    // מחזיר מספר עגול (למשל 67 במקום 66.666)
    return Math.round(percentage);
  }

// src/groups/group.entity.ts


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