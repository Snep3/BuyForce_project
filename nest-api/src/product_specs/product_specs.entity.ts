// src/entities/product-spec.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../products/product.entity'; // נדרש לקישור

@Entity('product_specs') // 1. ממופה לטבלת 'product_specs'
export class ProductSpec {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, integer, nextval)
  @PrimaryGeneratedColumn()
  id: number; //

  // 3. product_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'product_id', nullable: false })
  productId: string; //

  // 4. spec_key (character varying(255), not null)
  @Column({ type: 'character varying', length: 255, name: 'spec_key', nullable: false })
  specKey: string; //
  
  // 5. spec_value (character varying(255), nullable)
  @Column({ type: 'character varying', length: 255, name: 'spec_value', nullable: true })
  specValue: string; //

  // 6. created_at (timestamp without time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date; //
  
  // --- קישור Many-to-One (המפתח הזר) ---
  
  // 7. קישור לטבלת products (product_specs_product_id_fkey)
  @ManyToOne(() => Product, (product) => product.specs)
  @JoinColumn({ name: 'product_id' }) 
  product: Product; // אובייקט המוצר המלא שאליו מקושר המפרט
}