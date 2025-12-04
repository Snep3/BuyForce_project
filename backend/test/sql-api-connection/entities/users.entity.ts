// src/entities/user.entity.ts

import { Entity, PrimaryColumn, Column, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// ייבוא ה-Entities המקושרים:
import { Admin } from './admins.entity'; 
import { Notification } from './notifications.entity';
import { SearchHistory } from './search_history.entity';
import { Transaction } from './transactions.entity';
import { GroupMembership } from './group_memberships.entity';
import { UserSetting } from './user_settings.entity'; 
import { Wishlist } from './wishlist.entity';

@Entity('users') // 1. ממופה לטבלת 'users'
export class User {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, default uuid_generate_v4())
  @PrimaryColumn({ type: 'uuid' }) 
  id: string; //

  // 3. email (character varying(255), not null, UNIQUE)
  @Column({ type: 'character varying', length: 255, nullable: false, unique: true })
  email: string; //

  // 4. email_verified (boolean, default false)
  @Column({ type: 'boolean', name: 'email_verified', default: false })
  emailVerified: boolean; //
  
  // 5. password_hash (character varying(255), nullable)
  @Column({ type: 'character varying', length: 255, name: 'password_hash', nullable: true })
  passwordHash: string; //

  // 6. auth_provider (character varying(50), not null)
  @Column({ type: 'character varying', length: 50, name: 'auth_provider', nullable: false })
  authProvider: string; //

  // 7. provider_user_id (character varying(255), nullable)
  @Column({ type: 'character varying', length: 255, name: 'provider_user_id', nullable: true })
  providerUserId: string; //

  // 8. full_name (character varying(255), nullable)
  @Column({ type: 'character varying', length: 255, name: 'full_name', nullable: true })
  fullName: string; //

  // 9. phone (character varying(50), nullable)
  @Column({ type: 'character varying', length: 50, nullable: true })
  phone: string; //

  // 10. locale (character varying(10), default 'en')
  @Column({ type: 'character varying', length: 10, default: 'en' })
  locale: string; //

  // 11. currency (character varying(10), default 'ILS')
  @Column({ type: 'character varying', length: 10, default: 'ILS' })
  currency: string; //

  // 12. created_at, updated_at, deleted_at (timestamp with time zone)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date; //

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date; //

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'deleted_at' })
  deletedAt: Date; //
  
  // --- קישורי One-to-One / One-to-Many (Referenced by) ---
  
  // 13. Referenced by user_settings (fk_user_id) - קישור One-to-One
  @OneToOne(() => UserSetting, (settings) => settings.user)
  settings: UserSetting; 
  
  // 14. Referenced by admins (admins_user_id_fkey) - קישור One-to-Many
  @OneToMany(() => Admin, (admin) => admin.user)
  admins: Admin[]; 

  // 15. Referenced by notifications (notifications_user_id_fkey) - קישור One-to-Many
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[]; 

  // 16. Referenced by search_history (search_history_user_id_fkey) - קישור One-to-Many
  @OneToMany(() => SearchHistory, (history) => history.user)
  searchHistory: SearchHistory[]; 

  // 17. Referenced by transactions (transactions_user_id_fkey) - קישור One-to-Many
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[]; 

  // 18. Referenced by group_memberships (group_memberships_user_id_fkey) - קישור One-to-Many
  @OneToMany(() => GroupMembership, (membership) => membership.user)
  groupMemberships: GroupMembership[]; 

  // 19. Referenced by wishlist (wishlist_user_id_fkey) - קישור One-to-Many
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[]; 
}