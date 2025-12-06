// src/groups/dto/update-group.dto.ts

export class UpdateGroupDto {
  // @IsOptional()
  readonly status?: string; 
  
  // @IsOptional()
  readonly deadline?: Date; 
  
  // @IsOptional()
  readonly target_members?: number;
  
  // שדות עדכון לוגיסטיים, לדוגמה:
  readonly reached_target_at?: Date;
  readonly locked_at?: Date;
  // וכו'.
}