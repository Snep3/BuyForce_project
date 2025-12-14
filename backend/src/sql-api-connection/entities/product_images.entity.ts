// src/entities/product-image.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './products.entity'; // נדרש לקישור (ודא נתיב נכון)

@Entity('product_images') // 1. ממופה לטבלת 'product_images'
export class ProductImage {

  // 2. id (PRIMARY KEY)
  @PrimaryGeneratedColumn()
  id: number;

  // 3. product_id (FOREIGN KEY, uuid)
  @Column({ type: 'uuid', name: 'product_id', nullable: false })
  productId: string;

  // 4. image_url (text)
  @Column({ type: 'text', name: 'image_url', nullable: false })
  imageUrl: string;
  
  // 5. sort_order (integer, default 0)
  @Column({ type: 'integer', nullable: false, default: 0, name: 'sort_order' })
  sortOrder: number;

  // 6. created_at (timestamp without time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
  
  // --- קישור Many-to-One ---
  
  // 7. קישור לטבלת products
  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'product_id' }) 
  product: Product; // אובייקט המוצר המלא שאליו מקושרת התמונה
}