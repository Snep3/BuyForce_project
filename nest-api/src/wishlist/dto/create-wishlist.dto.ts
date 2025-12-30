import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
  
  @ApiProperty({ description: 'UUID של המשתמש שמוסיף לפריט' })
  @IsUUID()
  @IsNotEmpty()
  userId: string; 

  @ApiProperty({ description: 'UUID של המוצר המוסף לרשימה' })
  @IsUUID()
  @IsNotEmpty()
  productId: string; 
}
//הוספת מוצר