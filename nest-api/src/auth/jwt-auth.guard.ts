// src/auth/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const parts = (authHeader as string).split(' ');
    const token = parts.length === 2 ? parts[1] : null;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET not set');
      }
      const decoded = jwt.verify(token, secret) as any;

      (req as any).userId = decoded.id;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
