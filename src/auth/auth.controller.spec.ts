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
            login: jest.fn().mockResolvedValue({
              status: 'success',
              message: 'Login successful',
              data: {
                user_id: '1',
                access_token: 'mocked_token',
                token_type: 'Bearer',
                expires_in: 3600,
              },
            }),
            register: jest.fn().mockResolvedValue({
              status: 'success',
              message: 'User created successfully',
              data: {
                id: '1',
                name: 'test',
                email: 'test@mail.com',
                created_at: new Date().toISOString(),
              },
            }),
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

    expect(response).toEqual({
      status: 'success',
      message: 'Login successful',
      data: {
        user_id: expect.any(String),
        access_token: 'mocked_token',
        token_type: 'Bearer',
        expires_in: expect.any(Number),
      },
    });
    expect(authService.login).toHaveBeenCalledWith('test@mail.com', 'password');
  });

  it('should return a success message on register', async () => {
    const response = await authController.register({
      name: 'test',
      email: 'test@mail.com',
      password: 'password',
    });

    expect(response).toEqual({
      status: 'success',
      message: 'User created successfully',
      data: {
        id: '1',
        name: 'test',
        email: 'test@mail.com',
        created_at: expect.any(String),
      },
    });
    expect(authService.register).toHaveBeenCalledWith(
      'test',
      'test@mail.com',
      'password',
    );
  });
});
