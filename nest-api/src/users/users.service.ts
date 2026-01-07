import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ===== Signup רגיל (email+password) =====
  async signup(dto: { email: string; password: string; username?: string }) {
    const email = (dto.email || '').trim().toLowerCase();
    const password = dto.password || '';
    const username = dto.username?.trim() || null;

    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const exists = await this.userRepo.findOne({ where: { email: email as any } });
    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = email;
    (user as any).password = hashed;
    user.username = username ?? undefined;
    user.is_admin = false;

    // שדות פרופיל אופציונליים
    (user as any).fullName = null;
    (user as any).phone = null;
    (user as any).address = null;
    (user as any).avatarUrl = null;

    const saved = await this.userRepo.save(user as any);

    return {
      id: saved.id,
      email: saved.email,
      username: saved.username,
      is_admin: saved.is_admin,
      createdAt: saved.createdAt,
    };
  }

  // ===== Login רגיל (email+password) =====
  async login(dto: { email: string; password: string }) {
    const email = (dto.email || '').trim().toLowerCase();
    const password = dto.password || '';

    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const user = await this.userRepo.findOne({ where: { email: email as any } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // אם זה משתמש שנוצר דרך Google/Firebase ואין לו סיסמה
    if (!user.password) {
      throw new UnauthorizedException('This account uses Google login');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // ===== Profile: get me =====
  async getMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId as any } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ===== Profile: update me =====
  async updateMe(
    userId: string,
    patch: Partial<Pick<User, 'username'>> & {
      fullName?: string | null;
      phone?: string | null;
      address?: string | null;
      avatarUrl?: string | null;
    },
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId as any } });
    if (!user) throw new NotFoundException('User not found');

    if (patch.username !== undefined) user.username = patch.username ?? undefined;
    if (patch.fullName !== undefined) (user as any).fullName = patch.fullName;
    if (patch.phone !== undefined) (user as any).phone = patch.phone;
    if (patch.address !== undefined) (user as any).address = patch.address;
    if (patch.avatarUrl !== undefined) (user as any).avatarUrl = patch.avatarUrl;

    const saved = await this.userRepo.save(user as any);
    return saved;
  }
}
