import { 
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn 
} from 'typeorm';
import { User } from './users.entity'; // נדרש לקישור

@Entity('search_history') // 1. ממופה לטבלת 'search_history'
export class SearchHistory {

  // --- עמודות רגילות ---

  // 2. id (PRIMARY KEY, uuid, not null)
  @PrimaryGeneratedColumn( 'uuid' ) 
  id: string; 

  // 3. user_id (FOREIGN KEY, uuid, not null)
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string; 

  // 4. keyword (character varying(255), not null)
  @Column({ type: 'character varying', length: 255, nullable: false })
  keyword: string; 
  
  // 5. created_at (timestamp with time zone, default now())
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date; 
  
  // --- קישור Many-to-One (המפתח הזר) ---
  
  // 6. קישור לטבלת users (search_history_user_id_fkey)
  // ✅ תיקון: שינוי user.SearchHistory ל-user.searchHistory כדי להתאים ל-user.entity.ts
  @ManyToOne(() => User, (user) => user.searchHistory)
  @JoinColumn({ name: 'user_id' }) 
  user: User; // אובייקט המשתמש המלא שביצע את החיפוש
}