// nest-api/src/groups/group-member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from '../users/user.entity';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, { nullable: false })
  group: Group;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  // כמה יחידות המשתמש הזמין בקבוצה הזו (1 = רק הצטרפות)
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn()
  joinedAt: Date;
}
