// src/entities/product-performance.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './products.entity'; // נדרש לקישור

@Entity('product_performance') // 1. ממופה לטבלת 'product_performance'
export class ProductPerformance {

  // --- עמודות רגילות ---

  // 2. product_id (PRIMARY KEY ו-FOREIGN KEY, uuid, not null)
  // מכיוון שזהו גם המפתח הראשי וגם המפתח הזר, נשתמש ב-PrimaryColumn
  @PrimaryColumn({ type: 'uuid', name: 'product_id' })
  product_Id: string; //

  // 3. views_7d, joins_7d, wishlist_adds_7d (integer, default 0)
  @Column({ type: 'integer', default: 0, name: 'views_7d' })
  views_7d: number; //
  
  @Column({ type: 'integer', default: 0, name: 'joins_7d' })
  joins_7d: number; //

  @Column({ type: 'integer', default: 0, name: 'wishlist_adds_7d' })
  wishlist_Adds_7d: number; //

  // 4. conversion_rate (numeric(5,2), default 0)
  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, name: 'conversion_rate' })
  conversion_Rate: number; //

  // 5. last_aggregated_at (timestamp with time zone, nullable)
  @Column({ type: 'timestamp with time zone', nullable: true, name: 'last_aggregated_at' })
  last_Aggregated_At: Date; //
  
  // --- קישור Many-to-One (המפתח הזר) ---
  
  // 6. קישור לטבלת products (product_performance_product_id_fkey)
  @ManyToOne(() => Product, (product) => product.performance)
  @JoinColumn({ name: 'product_id' }) // הקישור נעשה דרך העמודה product_id
  product: Product; // אובייקט המוצר המלא שאליו מקושר הביצוע
}