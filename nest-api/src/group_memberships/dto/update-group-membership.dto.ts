import { IsOptional, IsIn, IsDateString } from 'class-validator';

export class UpdateGroupMembershipDto {
  @IsOptional()
  @IsIn(['PENDING_PREAUTH', 'PREAUTH_HELD', 'CHARGED', 'REFUNDED', 'CANCELLED', 'FAILED'])
  readonly status?: string; // נשאר status

  // מועד הביטול (אם יש)
  @IsOptional()
  @IsDateString()
  readonly cancelledAt?: string; // ⚠️ שונה מ-cancelled_at ל-cancelledAt (camelCase)

  // מועד ההחזר (אם יש)
  @IsOptional()
  @IsDateString()
  readonly refundedAt?: string; // ⚠️ שונה מ-refunded_at ל-refundedAt (camelCase)
}