//זהו DTO המשמש להסרת שדות רגישים לפני שליחה ללקוח.
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity'; // ✅ נתיב: יציאה כפולה (../../)

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    emailVerified: boolean;

    @ApiProperty({ required: false })
    fullName?: string;
    
    @ApiProperty({ required: false })
    locale?: string;

    @ApiProperty({ required: false })
    currency?: string;
    
    @ApiProperty()
    createdAt: Date;
    
    // שיטת המרה סטטית מ-Entity ל-DTO
    static fromEntity(user: User): UserResponseDto {
        const dto = new UserResponseDto();
        dto.id = user.id;
        dto.email = user.email;
        dto.createdAt = user.createdAt;
        return dto;
    }
}