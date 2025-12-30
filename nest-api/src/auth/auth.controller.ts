import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    // 👇 delegates to UsersService
    return this.usersService.signup(username, email, password);
  }

  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    // 👇 delegates to UsersService
    return this.usersService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    // 👇 req.user is injected by JwtAuthGuard
    return this.usersService.getMe(req.user.id);
  }
}
