// nest-api/src/orders/order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // מי עשה את ההזמנה
  @ManyToOne(() => User, { nullable: false })
  user: User;

  // לאיזו קבוצת רכישה שייכת ההזמנה
  @ManyToOne(() => Group, { nullable: false })
  group: Group;

  // סכום כולל של ההזמנה (אפשר לעדכן לפי הפריטים)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: string;

  // סטטוס בסיסי של הזמנה
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // 'pending' | 'paid' | 'canceled' וכו'

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
