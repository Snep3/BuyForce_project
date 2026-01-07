// nest-api/src/wishlist/wishlist.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Group } from '../groups/group.entity'; // וודא שהנתיב נכון

@Entity('wishlist')
// מונע כפילות: אותו משתמש לא יכול לשמור אותו מוצר פעמיים או אותה קבוצה פעמיים
@Unique(['userId', 'productId', 'groupId']) 
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

 @Column({ name: 'product_id', type: 'uuid', nullable: true })
productId?: string | null;

@Column({ name: 'group_id', type: 'uuid', nullable: true })
groupId?: string | null;


  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product?: Product | null;

  @ManyToOne(() => Group, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'group_id' })
  group?: Group | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}