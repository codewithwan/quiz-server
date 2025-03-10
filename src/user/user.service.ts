import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProfileDto } from './dto/get-profile.dto';
import { GetRoleDto } from './dto/get-role.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string): Promise<GetProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      status: 'success',
      message: 'User found',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
      },
    };
  }

  async getMyRole(userId: string): Promise<GetRoleDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      status: 'success',
      message: 'User found',
      data: {
        id: user.id,
        role: user.role,
      },
    };
  }

  async updateUserName(userId: string, newName: string): Promise<GetProfileDto> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: newName },
    });
    return {
      status: 'success',
      message: 'User name updated',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
      },
    };
  }
}
