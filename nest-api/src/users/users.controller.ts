// src/users/users.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GroupsService } from '../groups/groups.service'; // ייבוא של GroupsService 

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {}

  // בתוך users.controller.ts

@UseGuards(JwtAuthGuard)
@Get('groups') // זה יהפוך ל- /api/user/groups
async getGroups(@Req() req) {
  const userId = req.user?.id || req.user?.userId;
  // אנחנו פשוט קוראים לפונקציה שכבר כתבת ב-GroupsService!
  return this.groupsService.findUserGroups(userId); 
}

  @Post('signup')
  async signup(
    @Body() body: { username: string; email: string; password: string },
  ) {
    return this.usersService.signup(body.username, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    const userId = req?.user?.id || req?.user?.userId;
    return this.usersService.getMe(userId);
  }
  @Get()
findAll() {
  return this.usersService.findAll();
}
}
