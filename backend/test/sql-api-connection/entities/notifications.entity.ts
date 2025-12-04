// src/entities/notification.entity.ts

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './users.entity'; // נדרש לקישור

@Entity('notifications') // 1. ממופה לטבלת 'notifications'
export class Notification {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, not null)
  @PrimaryColumn({ type: 'uuid' }) 
  id: string; //

  // 3. user_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string; //

  // 4. type (character varying(50), not null)
  @Column({ type: 'character varying', length: 50, nullable: false })
  type: string; //

  // 5. title (character varying(255), not null)
  @Column({ type: 'character varying', length: 255, nullable: false })
  title: string; //
  
  // 6. body (text, not null)
  @Column({ type: 'text', nullable: false })
  body: string; //
  
  // 7. payload (jsonb, nullable)
  @Column({ type: 'jsonb', nullable: true })
  payload: any; //

  // 8. channel (character varying(50), not null)
  @Column({ type: 'character varying', length: 50, nullable: false })
  channel: string; //

  // 9. status (character varying(50), not null)
  @Column({ type: 'character varying', length: 50, nullable: false })
  status: string; //

  // 10. error_message (text, nullable)
  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string; //

  // 11. created_at (timestamp without time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date; //

  // 12. sent_at (timestamp with time zone, nullable)
  @Column({ type: 'timestamp with time zone', nullable: true, name: 'sent_at' })
  sentAt: Date; //
  
  // --- קישור Many-to-One (המפתח הזר) ---
  
  // 13. קישור לטבלת users (notifications_user_id_fkey)
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' }) 
  user: User; // אובייקט המשתמש המלא שאליו נשלחה ההודעה
}