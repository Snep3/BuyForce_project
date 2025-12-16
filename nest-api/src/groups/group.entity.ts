// src/groups/group.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // שם הקבוצה/קמפיין
  @Column()
  name: string;

  // תיאור קצר (אופציונלי)
  @Column({ type: 'text', nullable: true })
  description?: string;

  // מינימום מצטרפים כדי שהקבוצה "תצא לדרך"
  @Column({ default: 1 })
  minParticipants: number;

  // האם הקבוצה פעילה
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
