import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Wishlist } from '../wishlist/wishlist.entity';
import { Group } from '../groups/group.entity';
import { ProductSpec } from '../product_specs/product_specs.entity';
import { ProductPerformance } from '../product_performance/product_performance.entity';
import { ProductImage } from '../product_images/product_images.entity';
import { Category } from '../categories/categories.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'character varying', length: 255, unique: true, nullable: true })
  slug: string;

  @Column({ name: 'price_regular', type: 'decimal', precision: 12, scale: 2, default: 0 })
  priceRegular: number;

  @Column({ name: 'price_group', type: 'decimal', precision: 12, scale: 2, default: 0 })
  priceGroup: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'min_members', type: 'integer', default: 1 })
  minMembers: number;

  @Column({ name: 'max_members', type: 'integer', nullable: true })
  maxMembers: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'supplier_id', type: 'uuid', nullable: true })
  supplierId: string;

  @Column({ type: 'integer', name: 'category_id', nullable: true })
  categoryId: number;

  // --- Relations ---

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => ProductSpec, (spec) => spec.product)
  specs: ProductSpec[];

  @OneToOne(() => ProductPerformance, (perf) => perf.product)
  performance: ProductPerformance;

  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[];

  @OneToMany(() => Group, (group) => group.product)
  groups: Group[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}