import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne
} from 'typeorm';

import { Admin } from '../admins/admins.entity';
import { Wishlist } from '../wishlist/wishlist.entity';
import { Transaction } from '../transactions/transactions.entity';
import { UserSetting } from '../user_settings/user_settings.entity';
import { SearchHistory } from '../search_history/search_history.entity';
import { Notification } from '../notifications/notifications.entity'; // וודא שזה notification (ביחיד) אם זה שם הקובץ
import { GroupMembership } from '../group_memberships/group_memberships.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true }) 
  @Column() 
  email: string;

  @Index({ unique: true }) 
  @Column() 
  username: string;

  @Column() 
  password: string;

  @Column({ default: false, name: 'is_admin' }) 
  isAdmin: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // --- יחסים (Relations) ---

  // חיבור לניהול אדמינים
  @OneToMany(() => Admin, (admin) => admin.user)
  admins: Admin[];

  // חיבור לרשימות משאלות
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  // חיבור להיסטוריית טרנזקציות
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  // חיבור להגדרות משתמש (1:1)
  @OneToOne(() => UserSetting, (setting) => setting.user)
  settings: UserSetting;

  // חיבור להיסטוריית חיפוש
  @OneToMany(() => SearchHistory, (history) => history.user)
  searchHistory: SearchHistory[];

  // חיבור להתראות (פותר את השגיאה ב-notifications.entity.ts)
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  // חיבור לחברות בקבוצות (פותר את השגיאה ב-group_memberships.entity.ts)
  @OneToMany(() => GroupMembership, (membership) => membership.user)
  groupMemberships: GroupMembership[];
}