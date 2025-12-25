// src/sql-api-connection/entities/homepage_metrics.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/categories.entity';

@Entity('homepage_metrics')
export class HomepageMetric {
  @PrimaryGeneratedColumn()
  id: number;

  // ✅ התיקון: הסרנו את הקישוט @Column
  // עכשיו TypeORM יודע לנהל את המפתח הזר הזה רק דרך הקשר ManyToOne למטה.
  category_id: number; 
  
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' }) // TypeORM משתמש בזה כדי לדעת איזה עמודה לשמור
  category: Category;

  @Column({ name: 'week_start', type: 'timestamp' })
  week_start: Date;

  @Column({ name: 'joins_count', type: 'integer' })
  joins_count: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  gmv: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}