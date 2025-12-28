// src/groups/dto/create-group.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

   // מזהה המוצר של הקבוצה (products.id)
  @IsString()
  @IsNotEmpty()
  productId: string;

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
}
