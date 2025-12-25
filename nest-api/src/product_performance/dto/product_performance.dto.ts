import { IsUUID, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
export class ProductPerformanceDto {
  @IsUUID()
  readonly productId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly views7d?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly joins7d?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly wishlistAdds7d?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly conversionRate?: number;
}
