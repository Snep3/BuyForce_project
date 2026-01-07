import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { User } from '../users/user.entity';
import { FirebaseAdminService } from './firebase-admin.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  private signAppJwt(payload: { id: string; is_admin: boolean }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  async loginWithFirebase(idToken: string) {
    if (!idToken || typeof idToken !== 'string') {
      throw new UnauthorizedException('Missing idToken');
    }

    let decoded: any;
    try {
      decoded = await this.firebaseAdmin.verifyIdToken(idToken);
    } catch (e: any) {
      console.error('❌ verifyIdToken failed:', e?.message || e);
      throw new UnauthorizedException('Invalid Firebase token');
    }

    const firebaseUid: string | undefined = decoded?.uid;
    if (!firebaseUid) {
      throw new UnauthorizedException('Firebase token missing uid');
    }

    const email: string | undefined = decoded?.email;
    const fullName: string | undefined = decoded?.name;
    const avatarUrl: string | undefined = decoded?.picture;

    // נסה למצוא קודם לפי firebaseUid
    let user: User | null = await this.usersRepo.findOne({
      where: { firebaseUid: firebaseUid as any },
    });

    // אם אין — נסה לפי email
    if (!user && email) {
      user = await this.usersRepo.findOne({
        where: { email: email as any },
      });
    }

    // אם עדיין אין — יוצרים User חדש (בלי repo.create כדי לא ליפול על overload של מערך)
    if (!user) {
      const newUser = new User();

      newUser.email = email ?? `${firebaseUid}@firebase.local`;

      // אם אצלך password חייב, תשאיר ''.
      // אם שינית אותו ל-nullable, אפשר לשים null (אבל אז הטיפוס צריך לאפשר).
      (newUser as any).password = '';

      newUser.username = email ? email.split('@')[0] : `user_${firebaseUid.slice(0, 6)}`;
      newUser.is_admin = false;

      newUser.fullName = fullName ?? null;
      (newUser as any).phone = null;
      (newUser as any).address = null;
      newUser.avatarUrl = avatarUrl ?? null;

      (newUser as any).firebaseUid = firebaseUid;

      const saved = await this.usersRepo.save(newUser as any);
      user = saved as User;
    } else {
      // עדכונים אם חסר
      if (!(user as any).firebaseUid) (user as any).firebaseUid = firebaseUid;
      if (!user.fullName && fullName) user.fullName = fullName;
      if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;

      const saved = await this.usersRepo.save(user as any);
      user = saved as User;
    }

    // פה user תמיד קיים
    const token = this.signAppJwt({ id: user.id, is_admin: !!user.is_admin });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        is_admin: user.is_admin,
        createdAt: user.createdAt,
      },
    };
  }
}
