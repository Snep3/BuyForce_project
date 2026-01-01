import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      username,
      email,
      password: hashedPassword,
      is_admin: false,
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

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
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

 
  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.address !== undefined) user.address = dto.address;
    if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;

    const updated = await this.userRepo.save(user);

    const { password, ...safeUser } = updated;
    return safeUser;
  }

  private signToken(userId: string, is_admin: boolean) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not set');
    }

    return jwt.sign(
      { id: userId, is_admin },
      secret,
      { expiresIn: '7d' },
    );
  }
}
