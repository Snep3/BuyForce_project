import { 
  Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique 
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity'; 
// ✅ הוספת Unique Constraint כדי לאכוף שצירוף user_id ו-product_id הוא ייחודי
@Unique('unique_user_product', ['userId', 'productId'])
@Entity('wishlist') // 1. ממופה לטבלת 'wishlist'
export class Wishlist {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, not null)
  // ✅ תיקון: שימוש ב-PrimaryGeneratedColumn עבור UUID 
  @PrimaryGeneratedColumn('uuid') 
  id: string; 
  
  // 3. user_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string; 

  // 4. product_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'product_id', nullable: false })
  productId: string; 
  
  // 5. created_at (timestamp with time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date; 
  
  // --- קישורי Many-to-One (המפתחות הזרים) ---
  
  // 6. קישור לטבלת users (wishlist_user_id_fkey)
  @ManyToOne(() => User, (user) => user.wishlists)
  @JoinColumn({ name: 'user_id' }) 
  user: User; // אובייקט המשתמש המלא
  
  // 7. קישור לטבלת products (wishlist_product_id_fkey)
  @ManyToOne(() => Product, (product) => product.wishlists)
  @JoinColumn({ name: 'product_id' }) 
  product: Product; // אובייקט המוצר המלא
}