// src/entities/category.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
// ✅ תיקון: הסרת הסיומת .ts אם היא הבעיה:
import { Product } from './products.entity';
import { HomepageMetric } from './homepage_metrics.entity';
@Entity('categories') // ממופה לטבלת 'categories'
export class Category {

  // 1. id (PRIMARY KEY, integer, nextval)
  // משתמשים ב-PrimaryGeneratedColumn כי זה serial (מנוהל על ידי sequence)
  @PrimaryGeneratedColumn()
  id: number;

  // 2. name (character varying(100), not null, UNIQUE)
  @Column({ type: 'character varying', length: 100, nullable: false, unique: true })
  name: string;

  // 3. slug (character varying(100), not null, UNIQUE)
  @Column({ type: 'character varying', length: 100, nullable: false, unique: true })
  slug: string;
  
  // 4. icon_url (text, nullable)
  @Column({ type: 'text', nullable: true })
  iconUrl: string;
  
  // 5. sort_order (integer, not null, default 0)
  @Column({ type: 'integer', nullable: false, default: 0 })
  sortOrder: number;

  // 6. created_at (timestamp with time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  // 7. updated_at (timestamp with time zone, nullable)
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;
  
  // --- קישורים One-to-Many (Referenced by) ---
  
  // 8. קישור לטבלת products (fk_category)
  @OneToMany(() => Product, (product) => product.category)
  products: Product[]; // מערך של כל המוצרים בקטגוריה זו
  
  // 9. קישור לטבלת homepage_metrics (homepage_metrics_category_id_fkey)
  @OneToMany(() => HomepageMetric, (metric) => metric.category)
  homepageMetrics: HomepageMetric[]; // מערך של מדדי דף הבית הקשורים לקטגוריה
}