// src/group_memberships/dto/update-group-membership.dto.ts

export class UpdateGroupMembershipDto {
  // @IsOptional()
  // @IsIn(['PENDING_PREAUTH', 'PREAUTH_HELD', 'CHARGED', 'REFUNDED', 'CANCELLED', 'FAILED'])
  readonly status?: string; 
  
  // מועד הביטול (אם יש)
  readonly cancelled_at?: Date;
  
  // מועד ההחזר (אם יש)
  readonly refunded_at?: Date; 
}