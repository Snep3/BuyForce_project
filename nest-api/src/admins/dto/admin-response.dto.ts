// src/admins/dto/admin-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '../admins.entity';

export class AdminResponseDto {
    @ApiProperty({ description: 'UUID של רשומת האדמין' })
    id: string;

    @ApiProperty({ description: 'תפקיד האדמין (לדוגמה: super_admin)' })
    role: string;

    @ApiProperty({ description: 'המפתח הזר של המשתמש המקושר' })
    userId: string; // מחזירים רק את ה-UUID, לא את האובייקט User המלא

    @ApiProperty({ description: 'תאריך יצירת הרשומה' })
    createdAt: Date;

    // 💡 אין שדה 'user: UserResponseDto' כאן! זה מה ששובר את לולאת ה-JSON.

    public static fromEntity(admin: Admin): AdminResponseDto {
        return {
            id: admin.id,
            role: admin.role,
            userId: admin.userId,
            createdAt: admin.createdAt,
        };
    }
}