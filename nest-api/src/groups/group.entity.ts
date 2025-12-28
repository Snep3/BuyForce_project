// src/groups/group.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// ייצוג של קבוצת רכישה
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

  // מזהה המוצר שהקבוצה שייכת אליו
  @Column({ type: 'varchar', nullable: true })
productId: string;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
