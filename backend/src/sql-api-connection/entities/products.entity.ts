// src/entities/product.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './categories.entity';
import { Group } from './groups.entity';
import { ProductImage } from './product_images.entity';
import { ProductPerformance } from './product_performance.entity';
import { ProductSpec } from './product_specs.entity';
import { Wishlist } from './wishlist.entity';
// נניח ש-Supplier Entity קיים

@Entity('products') // 1. ממופה לטבלת 'products'
export class Product {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, default uuid_generate_v4())
  @PrimaryColumn({ type: 'uuid' }) 
  id: string; //

  // 3. name (character varying(255), not null)
  @Column({ type: 'character varying', length: 255, nullable: false })
  name: string; //

  // 4. slug (character varying(255), not null, UNIQUE)
  @Column({ type: 'character varying', length: 255, nullable: false, unique: true })
  slug: string; //

  // 5. category_id (FOREIGN KEY, integer, not null)
  @Column({ type: 'integer', name: 'category_id', nullable: false })
  categoryId: number; //

  // 6. description (text, nullable)
  @Column({ type: 'text', nullable: true })
  description: string; //

  // 7. price_regular, price_group (numeric(12,2), not null)
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: false, name: 'price_regular' })
  priceRegular: number; //

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: false, name: 'price_group' })
  priceGroup: number; //

  // 8. currency (character varying(10), not null, default 'ILS')
  @Column({ type: 'character varying', length: 10, nullable: false, default: 'ILS' })
  currency: string; //

  // 9. is_active (boolean, not null, default true)
  @Column({ type: 'boolean', nullable: false, default: true, name: 'is_active' })
  isActive: boolean; //

  // 10. min_members, max_members (integer, not null)
  @Column({ type: 'integer', nullable: false, name: 'min_members' })
  minMembers: number; //

  @Column({ type: 'integer', nullable: false, name: 'max_members' })
  maxMembers: number; //

  // 11. supplier_id (uuid, nullable)
  @Column({ type: 'uuid', name: 'supplier_id', nullable: true })
  supplierId: string; //

  // 12. created_at, updated_at, deleted_at (timestamp with time zone)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date; //

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date; //

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'deleted_at' })
  deletedAt: Date; //
  
  // --- קישור Many-to-One (מפתחות זרים היוצאים מהטבלה) ---
  
  // 13. קישור לטבלת categories (fk_category)
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' }) 
  category: Category; // אובייקט הקטגוריה המלא

  // --- קישורי One-to-Many ו-One-to-One (Referenced by) ---
  
  // 14. Referenced by groups (groups_product_id_fkey)
  @OneToMany(() => Group, (group) => group.product)
  groups: Group[]; // מערך של קבוצות מקושרות

  // 15. Referenced by product_images (product_images_product_id_fkey)
  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[]; // מערך של תמונות מוצר

  // 16. Referenced by product_specs (product_specs_product_id_fkey)
  @OneToMany(() => ProductSpec, (spec) => spec.product)
  specs: ProductSpec[]; // מערך של מפרטי מוצר

  // 17. Referenced by wishlist (wishlist_product_id_fkey)
  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[]; // מערך רשומות רשימת המשאלות

  // 18. Referenced by product_performance (product_performance_product_id_fkey)
  // זהו קישור One-to-One (מפתח ראשי משותף)
  @OneToOne(() => ProductPerformance, (performance) => performance.product)
  performance: ProductPerformance; 
}
