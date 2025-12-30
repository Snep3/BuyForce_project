// src/products/dto/add-comment.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
