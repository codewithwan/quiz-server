import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { GetProfileDto } from './dto/get-profile.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getProfile: jest.fn(),
            updateUserName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = 'test-id';
      const userProfile: GetProfileDto = {
        status: 'success',
        message: 'User found',
        data: { id: userId, name: 'Test User', email: 'test@example.com', created_at: new Date() },
      };
      jest.spyOn(service, 'getProfile').mockResolvedValue(userProfile);

      const result = await controller.getProfile({ user: { userId } } as any);
      expect(result).toBe(userProfile);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(service, 'getProfile').mockRejectedValue(new Error('User not found'));

      await expect(controller.getProfile({ user: { userId: 'invalid-id' } } as any)).rejects.toThrow('User not found');
    });
  });

  describe('updateUserName', () => {
    it('should update user name', async () => {
      const userId = 'test-id';
      const newName = 'New Name';
      const updatedProfile: GetProfileDto = {
        status: 'success',
        message: 'User name updated',
        data: { id: userId, name: newName, email: 'test@example.com', created_at: new Date() },
      };
      jest.spyOn(service, 'updateUserName').mockResolvedValue(updatedProfile);

      const result = await controller.updateUserName({ user: { userId } } as any, newName);
      expect(result).toBe(updatedProfile);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(service, 'updateUserName').mockRejectedValue(new Error('User not found'));

      await expect(controller.updateUserName({ user: { userId: 'invalid-id' } } as any, 'New Name')).rejects.toThrow('User not found');
    });
  });
});
