import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, ConfigModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
