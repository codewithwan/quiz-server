import {
  Controller,
  Get,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../types/user.interface';
import { GetProfileDto } from './dto/get-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() request: User): Promise<GetProfileDto> {
    try {
      const userId = request.user.userId;
      return await this.userService.getProfile(userId);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProfileById(@Param('id') id: string): Promise<GetProfileDto> {
    try {
      return await this.userService.getProfile(id);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-name')
  async updateUserName(@Req() request: User, @Body('name') newName: string): Promise<GetProfileDto> {
    try {
      const userId = request.user.userId;
      return await this.userService.updateUserName(userId, newName);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
