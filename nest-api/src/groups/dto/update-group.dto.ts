// src/groups/dto/update-group.dto.ts
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  minParticipants?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
