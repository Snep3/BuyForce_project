import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator'; // חסר לך ה-Import הזה
import { GroupStatus } from '../group.entity';       // חסר לך הקישור ל-Enum שהגדרנו

export class GroupCardDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  minParticipants: number;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose() // <--- תוסיף את זה פה
  joined_count: number;

  @Expose() // <--- הוסף את זה פה
  target_members: number;

@IsEnum(GroupStatus)
@IsOptional()
status?: GroupStatus;

@Expose()
@IsOptional() // מאפשר ליצור קבוצה בלי דדליין אם רוצים
deadline: Date;

  @Expose()
  progress_pct: number; // הוסף את השורה הזו!

  @Expose()
  isNearGoal: boolean; // אם תרצה שגם זה יופיע
}
