// src/entities/product-performance.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity'; // נדרש לקישור לטבלת Products

@Entity('product_performance')
export class ProductPerformance {
  // --- עמודה ראשית: product_id (Primary + Foreign Key) ---
  @PrimaryColumn({ type: 'uuid', name: 'product_id' })
  productId: string;

  // --- שדות ביצועים ---
  @Column({ type: 'integer', default: 0, name: 'views_7d' })
  views7d: number;

  @Column({ type: 'integer', default: 0, name: 'joins_7d' })
  joins7d: number;

  @Column({ type: 'integer', default: 0, name: 'wishlist_adds_7d' })
  wishlistAdds7d: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, name: 'conversion_rate' })
  conversionRate: number;

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'lastUpdate' })
  lastUpdated: Date;

  // --- קישור Many-to-One לטבלת products ---
  @ManyToOne(() => Product, (product) => product.performance)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
