import { IsEmail, IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// מרחיב את CreateUserDto אך הופך את כל השדות לאופציונליים
export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @ApiProperty({ description: 'סיסמה חדשה (אופציונלי)', required: false })
    @IsOptional()
    @IsString()
    @MinLength(8) 
    password?: string;
    
    // ב-Update לא מאפשרים לשנות את ה-email דרך ה-DTO הזה
    email?: string; 
}