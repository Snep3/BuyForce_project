// src/groups/dto/update-group.dto.ts
import { IsString, IsOptional, IsInt, Min, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
// ייבוא ה-Enum מה-Create DTO (או מהקובץ הנפרד אם יצרת אחד)
import { GroupStatus } from './create-group.dto';

export class UpdateGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  minParticipants?: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // הוספת אפשרות לעדכן את הסטטוס
  @IsEnum(GroupStatus)
  @IsOptional()
  status?: GroupStatus;
}