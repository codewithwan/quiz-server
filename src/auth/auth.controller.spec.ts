import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest
              .fn()
              .mockResolvedValue({ access_token: 'mocked_token' }),
            register: jest
              .fn()
              .mockResolvedValue({ message: 'User registered' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return an access token on login', async () => {
    const response = await authController.login({
      email: 'test@mail.com',
      password: 'password',
    });

    expect(response).toEqual({ access_token: 'mocked_token' });
    expect(authService.login).toHaveBeenCalledWith('test@mail.com', 'password');
  });

  it('should return a success message on register', async () => {
    const response = await authController.register({
      name: 'test',
      email: 'test@mail.com',
      password: 'password',
    });

    expect(response).toEqual({ message: 'User registered' });
    expect(authService.register).toHaveBeenCalledWith('test', 'test@mail.com', 'password');
  });
});
