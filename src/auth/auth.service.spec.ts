import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const user = { id: '1', name: 'Test', email: 'test@example.com', password: 'hashedPassword', createdAt: new Date() };
      jest.spyOn(prisma.user, 'create').mockResolvedValue(user);

      const result = await service.register('Test', 'test@example.com', 'password');

      expect(result).toEqual({
        id: user.id,
        data: { name: user.name, email: user.email },
        created_at: user.createdAt,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(prisma.user, 'create').mockRejectedValue({ code: 'P2002', meta: { target: ['email'] } });

      await expect(service.register('Test', 'test@example.com', 'password')).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const user = { id: '1', name: 'Test', email: 'test@example.com', password: await bcrypt.hash('password', 10), createdAt: new Date() };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.login('test@example.com', 'password');

      expect(result).toEqual({ access_token: 'test-token' });
    });

    it('should throw UnauthorizedException if invalid credentials', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });
});
