// src/sql-api-connection/transactions/dto/transaction.dto.ts

import { Expose, Type } from 'class-transformer';
import { TransactionStatus, TransactionType } from '../../entities/transactions.entity';
// 💡 אם אתה מייבא Entitys קשורים (כמו User או Group) לתוך ה-Transaction Entity:
// import { User } from '../../entities/users.entity'; 
// import { Group } from '../../entities/groups.entity';

// זהו ה-DTO שנשלח ללקוח לאחר קריאת נתונים
export class TransactionDto {
    
    // 🔑 ID של רשומת העסקה
    @Expose()
    id: string;

    // 🔑 מפתחות זרים
    @Expose()
    userId: string;
    
    @Expose()
    groupId: string;
    
    // 🔑 פרטי העסקה
    @Expose()
    amount: number;
    
    @Expose()
    type: TransactionType;

    @Expose()
    status: TransactionStatus;
    
    @Expose()
    providerRef: string;
    
    @Expose()
    errorCode?: string;

    @Expose()
    errorMessage?: string;

    // 🔑 נתוני מערכת
    @Expose()
    idempotencyKey: string;
    
    @Expose()
    createdAt: Date;
    
    @Expose()
    updatedAt: Date;

    /*
    // 💡 דוגמה לשליפת נתונים מקושרים אם אתה משתמש ב-relations ב-TypeORM
    @Expose()
    @Type(() => UserDto) // נניח שיש לך UserDto
    user: User;
    */
}