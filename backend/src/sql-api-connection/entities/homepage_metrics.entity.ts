// src/entities/homepage-metric.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Category } from './categories.entity'; // נדרש לקישור

@Entity('homepage_metrics') // 1. ממופה לטבלת 'homepage_metrics'
export class HomepageMetric {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, integer, nextval)
  @PrimaryGeneratedColumn()
  id: number; //

  // 3. category_id (FOREIGN KEY, integer, not null)
  @Column({ type: 'integer', name: 'category_id', nullable: false })
  categoryId: number; //

  // 4. week_start (date, not null)
  @Column({ type: 'date', name: 'week_start', nullable: false })
  weekStart: Date; //
  
  // 5. joins_count (integer, default 0)
  @Column({ type: 'integer', nullable: false, default: 0, name: 'joins_count' })
  joinsCount: number; //

  // 6. gmv (numeric(14,2), default 0)
  // TypeORM ממפה numeric(P,S) ל-number/string
  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: false, default: 0 })
  gmv: number; //

  // 7. created_at (timestamp without time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date; //
  
  // --- קישור Many-to-One (המפתח הזר) ---
  
  // 8. קישור לטבלת categories (homepage_metrics_category_id_fkey)
  @ManyToOne(() => Category, (category) => category.homepageMetrics)
  @JoinColumn({ name: 'category_id' }) 
  category: Category; // אובייקט הקטגוריה המלא המקושר
}