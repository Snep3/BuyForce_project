// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signup(username: string, email: string, password: string) {
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }

    const existing = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      throw new Error('User already exists');
    }

    const user = new this.userModel({ username, email, password });
    await user.save();

    const token = this.signToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password required');
    }

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // @ts-ignore
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.signToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }

  async addFavorite(userId: string, productId: string) {
    const updated = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: productId } },
        { new: true },
      )
      .select('-password');

    return updated;
  }

  private signToken(id: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not set');
    }

    return jwt.sign({ id }, secret, { expiresIn: '7d' });
  }
}
