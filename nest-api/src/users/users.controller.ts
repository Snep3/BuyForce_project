// src/users/users.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersService.signup(
        username,
        email,
        password,
      );
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersService.login(email, password);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await this.usersService.getMe(userId);
      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/favorites')
  async addFavorite(
    @Req() req: Request,
    @Body('productId') productId: string,
    @Res() res: Response,
  ) {
    try {
      const userId = (req as any).userId;

      if (!productId) {
        return res
          .status(400)
          .json({ error: 'productId is required' });
      }

      const user = await this.usersService.addFavorite(
        userId,
        productId,
      );
      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
