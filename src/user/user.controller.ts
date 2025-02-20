import { Controller, Get, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';
import { GetProfileDto } from './dto/get-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() request: AuthenticatedRequest): Promise<GetProfileDto> {
    try {
      const userId = request.user.userId;
      return await this.userService.getProfile(userId);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
