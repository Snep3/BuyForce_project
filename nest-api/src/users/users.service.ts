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
    private readonly userRepo: Repository<User>,
  ) {}

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
      is_admin: false, // default
    });

    const saved = await this.userRepo.save(user);

    const token = this.signToken(saved.id, saved.is_admin);

    return {
      token,
      user: {
        id: saved.id,
        username: saved.username,
        email: saved.email,
        is_admin: saved.is_admin,
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

    const token = this.signToken(user.id, user.is_admin);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // לא מחזירים סיסמה
    const { password, ...safe } = user;
    return safe;
  }

  private signToken(id: string, is_admin: boolean) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');

    return jwt.sign({ id, is_admin }, secret, { expiresIn: '7d' });
  }
}
