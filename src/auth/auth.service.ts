import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { jwtConstants } from '../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      return {
        status: 'success',
        message: 'User created successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      };
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    const expiresIn = jwtConstants.signOptions.expiresIn;
    const expiresInTimestamp =
      Math.floor(Date.now() / 1000) +
      (typeof expiresIn === 'string' ? parseInt(expiresIn) * 3600 : expiresIn);

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        user_id: user.id,
        access_token: token,
        token_type: 'Bearer',
        expires_in: expiresInTimestamp,
      },
    };
  }
}
