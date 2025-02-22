import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = 'test-id';
      const user = { id: userId, name: 'Test User', email: 'test@example.com', password: 'hashedPassword', createdAt: new Date() };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      const result = await service.getProfile(userId);
      expect(result.data.id).toBe(userId);
      expect(result.data.name).toBe('Test User');
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.getProfile('invalid-id')).rejects.toThrow('User not found');
    });
  });

  describe('updateUserName', () => {
    it('should update user name', async () => {
      const userId = 'test-id';
      const newName = 'New Name';
      const user = { id: userId, name: newName, email: 'test@example.com', password: 'hashedPassword', createdAt: new Date() };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(user);

      const result = await service.updateUserName(userId, newName);
      expect(result.data.name).toBe(newName);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'update').mockImplementation(() => {
        throw new Error('User not found');
      });

      await expect(service.updateUserName('invalid-id', 'New Name')).rejects.toThrow('User not found');
    });
  });
});
