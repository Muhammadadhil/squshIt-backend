import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Response } from 'express';
import { UserRepository } from 'src/user/repositories/implementation/user.repositoy';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    res: Response,
  ): Promise<void> {
    const userExists = await this.userRepository.findOne(email);
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword };
    const newUser = await this.userRepository.create(user);

    const payload = { name, userId: newUser._id as string, email };
    const token = await this.generateJwtToken(payload);
    this.setCookie(res, token);
  }

  async login(email: string, password: string, res: Response): Promise<void> {
    const user = await this.userRepository.findOne(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: { name: string; email: string; userId: string } = {
      name: user.name,
      email: user.email,
      userId: user.id,
    };
    const token = await this.generateJwtToken(payload);
    console.log('tokenvvvvvvvv:', token);
    this.setCookie(res, token);
    console.log('cookie set');
  }

  async generateJwtToken(payload: {
    name: string;
    userId: string;
    email: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private setCookie(res: Response, token: string): void {
    console.log('Setting cookie with token:', token);
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: 'lax',
      secure: true, // Use true for production
      path: '/',
    });
    console.log('Cookie set:', res.getHeaders());
  }
}
