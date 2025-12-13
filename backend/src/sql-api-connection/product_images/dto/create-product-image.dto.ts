import { IsUUID, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @IsUUID()
  productId: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
