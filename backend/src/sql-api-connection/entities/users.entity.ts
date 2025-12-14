// src/entities/users.entity.ts

import { 
  Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn 
} from 'typeorm';
import { Exclude } from 'class-transformer'; // ⬅️ יש לוודא שזה מיובא!
// ייבוא ה-Entities המקושרים:
import { Admin } from './admins.entity'; 
import { Notification } from './notifications.entity';
import { SearchHistory } from './search_history.entity';
import { Transaction } from './transactions.entity';
import { GroupMembership } from './group_memberships.entity';
import { UserSetting } from './user_settings.entity'; 
import { Wishlist } from './wishlist.entity';

@Entity('users') 
export class User {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid)
  @PrimaryGeneratedColumn('uuid') 
  id: string; 
// ... (שדות רגילים ממשיכים כפי שהם) ...
  @Column({ type: 'character varying', length: 255, nullable: false, unique: true })
  email: string;
  @Column({ type: 'boolean', name: 'email_verified', default: false })
  emailVerified: boolean; 
  @Column({ type: 'character varying', length: 255, name: 'password_hash', nullable: true })
  passwordHash: string; 
  @Column({ type: 'character varying', length: 50, name: 'auth_provider', nullable: true })
  authProvider: string; 
  @Column({ type: 'character varying', length: 255, name: 'provider_user_id', nullable: true })
  providerUserId: string; 
  @Column({ type: 'character varying', length: 255, name: 'full_name', nullable: true })
  fullName: string; 
  @Column({ type: 'character varying', length: 50, nullable: true })
  phone: string; 
  @Column({ type: 'character varying', length: 10, default: 'en' })
  locale: string; 
  @Column({ type: 'character varying', length: 10, default: 'ils' })
  currency: string; 
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date; 
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date; 
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date; 
  
  // --- קישורי One-to-One / One-to-Many (Referenced by) ---
  
  // 13. Referenced by user_settings (fk_user_id) - קישור One-to-One
  @Exclude() // ⬅️ מונע הכללת האובייקט המלא בתגובת JSON
  @OneToOne(() => UserSetting, (settings) => settings.user, { lazy: true }) // ⬅️ טעינה עצלה
  settings: UserSetting; 
  
  // 14. Referenced by admins (admins_user_id_fkey) - קישור One-to-Many (הקשר הקריטי)
  @Exclude() // ⬅️ קריטי: שובר את הלולאה Admin -> User -> Admins
  @OneToMany(() => Admin, (admin) => admin.user, { lazy: true }) // ⬅️ טעינה עצלה
  admins: Admin[]; 

  // 15. Referenced by notifications (notifications_user_id_fkey) - קישור One-to-Many
  @Exclude()
  @OneToMany(() => Notification, (notification) => notification.user, { lazy: true })
  notifications: Notification[]; 

  // 16. Referenced by search_history (search_history_user_id_fkey) - קישור One-to-Many
  @Exclude()
  @OneToMany(() => SearchHistory, (history) => history.user, { lazy: true })
  searchHistory: SearchHistory[]; 

  // 17. Referenced by transactions (transactions_user_id_fkey) - קישור One-to-Many
  @Exclude()
  @OneToMany(() => Transaction, (transaction) => transaction.user, { lazy: true })
  transactions: Transaction[]; 

  // 18. Referenced by group_memberships (group_memberships_user_id_fkey) - קישור One-to-Many
  @Exclude()
  @OneToMany(() => GroupMembership, (membership) => membership.user, { lazy: true })
  groupMemberships: GroupMembership[]; 

  // 19. Referenced by wishlist (wishlist_user_id_fkey) - קישור One-to-Many
  @Exclude()
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user, { lazy: true })
  wishlists: Wishlist[]; 
}