import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ===== Signup =====
  @Post('signup')
  async signup(@Body() body: { username?: string; email: string; password: string }) {
    return this.usersService.signup({
      username: body.username,
      email: body.email,
      password: body.password,
    });
  }

  // ===== Login =====
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // תחזיר כאן את המשתמש עצמו, אם אצלך AuthService מחזיר token
    // אז תחליף את זה לקריאה ל-AuthService.
    const user = await this.usersService.login({
      email: body.email,
      password: body.password,
    });

    return user;
  }

  // ===== Me =====
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.usersService.getMe(userId);
  }

  // ===== Update my profile =====
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: any, @Body() dto: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.usersService.updateMe(userId, dto);
  }
}
