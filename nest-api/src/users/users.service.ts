// src/users/users.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // 👈 השם כאן הוא userRepo
  ) {}

  // פונקציה חדשה שביקשת כדי לראות את כל המשתמשים
  async findAll(): Promise<User[]> {
    return await this.userRepo.find(); // 👈 תיקון השם ל-userRepo
  }

  async signup(username: string, email: string, password: string) {
    if (!username || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    const existing = await this.userRepo.findOne({
      where: [{ email }, { username }],
    });

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      username,
      email,
      password: hashed,
      isAdmin: false, 
    });

    const saved = await this.userRepo.save(user);
    const token = this.signToken(saved.id, saved.isAdmin);

    return {
      token,
      user: {
        id: saved.id,
        username: saved.username,
        email: saved.email,
        isAdmin: saved.isAdmin,
      },
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password required');
    }

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken(user.id, user.isAdmin);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...safe } = user;
    return safe;
  }

  private signToken(id: string, isAdmin: boolean) {
    const secret = process.env.JWT_SECRET || 'fallback_secret'; // הוספתי fallback למקרה שאין ENV
    return jwt.sign({ id, isAdmin }, secret, { expiresIn: '7d' });
  }
}