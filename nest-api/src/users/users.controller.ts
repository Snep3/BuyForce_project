// src/users/users.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// --- Swagger ---
import {

  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

// >>> added swagger
@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // >>> added swagger
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation or signup error' })
  @ApiBody({
    schema: {
      example: {
        username: 'john123',
        email: 'john@example.com',
        password: '123456',
      },
    },
  })
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

  // >>> added swagger
  @Post('login')
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      example: {
        email: 'john@example.com',
        password: '123456',
      },
    },
  })
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

  // >>> added swagger
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently logged in user details' })
  @ApiResponse({ status: 200, description: 'User data returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized - missing/invalid token' })
  async getMe(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await this.usersService.getMe(userId);
      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
// >>>added - update user profile
@UseGuards(JwtAuthGuard)
@Patch('me')
@ApiBearerAuth()
@ApiOperation({ summary: 'Update logged-in user profile' })
@ApiResponse({ status: 200, description: 'User updated successfully' })
@ApiBody({
  schema: {
    example: {
      username: 'newName',
      email: 'newEmail@example.com',
      password: 'newPassword'
    },
  },
})
async updateMe(
  @Req() req: Request,
  @Body() body: any,
  @Res() res: Response
) {
  try {
    const userId = (req as any).userId;
    const updated = await this.usersService.updateUser(userId, body);

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// >>>added - delete user account
@UseGuards(JwtAuthGuard)
@Delete('me')
@ApiBearerAuth()
@ApiOperation({ summary: 'Delete logged-in user account' })
@ApiResponse({ status: 200, description: 'Account deleted successfully' })
async deleteMe(@Req() req: Request, @Res() res: Response) {
  try {
    const userId = (req as any).userId;
    const deleted = await this.usersService.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'Account deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}


// >>>added - remove favorite product
@UseGuards(JwtAuthGuard)
@Delete('me/favorites/:productId')
@ApiBearerAuth()
@ApiOperation({ summary: 'Remove a product from favorites' })
@ApiParam({ name: 'productId', required: true })
@ApiResponse({ status: 200, description: 'Favorite removed successfully' })
async removeFavorite(
  @Req() req: Request,
  @Param('productId') productId: string,
  @Res() res: Response,
) {
  try {
    const userId = (req as any).userId;

    const updated = await this.usersService.removeFavorite(
      userId,
      productId,
    );

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}




  // >>> added swagger
  @UseGuards(JwtAuthGuard)
  @Post('me/favorites')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a product to user favorites' })
  @ApiResponse({ status: 200, description: 'Favorite added successfully' })
  @ApiResponse({ status: 400, description: 'productId missing' })
  @ApiBody({
    schema: {
      example: {
        productId: 'abc123',
      },
    },
  })
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
