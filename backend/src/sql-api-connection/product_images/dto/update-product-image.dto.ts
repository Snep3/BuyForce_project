import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateProductImageDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
