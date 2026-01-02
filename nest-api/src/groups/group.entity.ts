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
import { Expose, Transform } from 'class-transformer';
import { Transaction } from '../transactions/transactions.entity';
import { GroupMembership } from '../group_memberships/group_memberships.entity';
import { Product } from '../products/product.entity';

// 1. הגדרת רשימת הסטטוסים האפשריים
export enum GroupStatus {
  OPEN = 'OPEN',
  LOCKED = 'LOCKED',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
}

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    name: 'status',
    type: 'character varying',
    length: 20,
    default: GroupStatus.OPEN,
  })
  status: string;

  @Column({ name: 'active_group', type: 'boolean', default: true })
  activeGroup: boolean;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @Column({ type: 'int', default: 0 })
  joined_count: number;

  @Column({ type: 'int', default: 10 })
  target_members: number;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  // הוסף את זה מתחת לשדה ה-description הקיים
@Column("simple-array", { nullable: true })
productIds: string[];

  /**
   * שדה מחושב עבור אחוז התקדמות.
   * השדה הזה לא נשמר ב-DB, הוא מחושב בכל שליפה ונשלח ללקוח ב-JSON.
   */
  @Expose()
  get progress_pct(): number {
    if (!this.target_members || this.target_members <= 0) return 0;
    
    // חישוב האחוז
    const percentage = (this.joined_count / this.target_members) * 100;
    
    // החזרת מספר עגול (0 עד 100)
    return Math.min(Math.round(percentage), 100);
  }

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

// בתוך group.entity.ts

@Expose()
get currentStatus(): string {
  const now = new Date();
  if (this.joined_count >= this.target_members) return 'COMPLETED';
  if (this.deadline && this.deadline < now) return 'FAILED';
  return 'OPEN';
}


}
