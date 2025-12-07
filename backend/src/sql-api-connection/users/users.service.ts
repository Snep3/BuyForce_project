import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import * as bcrypt from 'bcrypt'; 
import { CreateUserDto } from './dto/create-user.dto'; 
import { UpdateUserDto } from './dto/update-user.dto'; 
import { User } from '../entities/users.entity'; // ✅ תיקון נתיב הייבוא

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. CREATE: יצירת משתמש חדש
  async create(createUserDto: CreateUserDto): Promise<User> {
    // בדיקה אם המייל כבר קיים
    const existingUser = await this.usersRepository.findOne({ 
        where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
        throw new ConflictException(`User with email ${createUserDto.email} already exists.`);
    }
    
    // הצפנת סיסמה
    const passwordHash = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    
    // יצירת האובייקט - אנחנו ממפים את הסיסמה מה-DTO ל-passwordHash של ה-Entity
    const newUser = this.usersRepository.create({
        ...createUserDto,
        passwordHash: passwordHash,
        // ה-DTO מכיל password, ה-Entity לא. ה-create של TypeORM יתעלם ממה שלא קיים ב-Entity,
        // אבל כדי להיות נקיים, עדיף להפריד. בקוד פשוט זה יעבוד כי create מסנן שדות.
    }); 
    
    return await this.usersRepository.save(newUser); 
  }

  // 2. READ: שליפת משתמש לפי ID (כולל משתמשים שנמחקו רך)
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      withDeleted: true // כולל משתמשים שנמחקו רך
    });
    
    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  
  // 3. READ: שליפת משתמש פעיל לפי ID
  async findOneActive(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id } 
      // אין צורך ב-deletedAt: null, זו ברירת המחדל של TypeORM אלא אם כן כתבת withDeleted: true
    });
    
    if (!user) {
        throw new NotFoundException(`Active user with ID ${id} not found`);
    }
    return user;
  }
  
  // 4. UPDATE: עדכון פרטי משתמש
  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneActive(id); 
    
    // הפרדה בין הסיסמה (אם קיימת) לשאר הנתונים
    const { password, ...rest } = updateDto;
    
    // אובייקט העדכון
    const updateData: Partial<User> = { ...rest };

    // אם נשלחה סיסמה חדשה, מצפינים אותה ומכניסים ל-passwordHash
    if (password) {
        updateData.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
    
    // מיזוג הנתונים ושמירה
    this.usersRepository.merge(user, updateData);
    return await this.usersRepository.save(user);
  }
  
  // 5. DELETE: מחיקה רכה (Soft Delete)
  async remove(id: string): Promise<void> {
      const result = await this.usersRepository.softDelete(id);
      if (result.affected === 0) {
          throw new NotFoundException(`User with ID ${id} not found for deletion.`);
      }
  }
}
// ביצעתי התקנה של bcrypt והשתמשתי בו לאששת סיסמאות.
//npm install bcrypt
//npm install -D @types/bcrypt