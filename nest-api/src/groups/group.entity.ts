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
import { GroupMember } from './group-member.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int' })
  minParticipants: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // חדש 👇
  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  // חדש 👇
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ManyToOne(() => Product, (product) => product.groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  productId: string;

  @OneToMany(() => GroupMember, (gm) => gm.group)
  members: GroupMember[];

  @OneToMany(() => Order, (order) => order.group)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
