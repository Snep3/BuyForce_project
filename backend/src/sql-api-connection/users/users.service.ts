// src/sql-api-connection/users/users.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm'; // ⬅️ נוסף IsNull
import * as bcrypt from 'bcrypt'; 
import { CreateUserDto } from './dto/create-user.dto'; 
import { UpdateUserDto } from './dto/update-user.dto'; 
import { User } from '../entities/users.entity'; 

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
			where: { email: createUserDto.email },
      withDeleted: true // כולל משתמש שנמחק רך אבל עדיין תופס את המייל
		});
		
		if (existingUser) {
			throw new ConflictException(`User with email ${createUserDto.email} already exists.`);
		}
		
		// הצפנת סיסמה
		const passwordHash = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
		
		// יצירת האובייקט
		const newUser = this.usersRepository.create({
			...createUserDto,
			passwordHash: passwordHash,
			// ה-DTO מכיל password, ה-create יסנן אותו.
		}); 
		
		return await this.usersRepository.save(newUser); 
	}

  // 2. READ ALL: שליפת כל המשתמשים הפעילים (המתודה החסרה)
	async findAllActive(): Promise<User[]> {
		return this.usersRepository.find({
			where: { deletedAt: IsNull() }, // ⬅️ תנאי למשתמשים שאינם מחוקים
		});
	}

	// 3. READ: שליפת משתמש לפי ID (כולל משתמשים שנמחקו רך)
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
	
	// 4. READ: שליפת משתמש פעיל לפי ID
	async findOneActive(id: string): Promise<User> {
		const user = await this.usersRepository.findOne({ 
			where: { id } 
		});
		
		if (!user) {
			throw new NotFoundException(`Active user with ID ${id} not found`);
		}
		return user;
	}
	
	// 5. UPDATE: עדכון פרטי משתמש
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
	
	// 6. DELETE: מחיקה רכה (Soft Delete)
	async remove(id: string): Promise<void> {
		const result = await this.usersRepository.softDelete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`User with ID ${id} not found for deletion.`);
		}
	}
}