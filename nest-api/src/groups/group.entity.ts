// src/groups/group.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'int', default: 0 })
  minParticipants: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // המזהה של המוצר יכול להיות אופציונלי / ריק (למקרה שמנתקים מוצר מהקבוצה)
  @Column({ type: 'uuid', nullable: true })
  productId?: string | null;

  @ManyToOne(() => Product, (product) => product.groups, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'productId' })
  product?: Product | null;

  @OneToMany(() => Order, (order) => order.group)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
