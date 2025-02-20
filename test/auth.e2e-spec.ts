import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const timestamp = new Date().getTime();
    const email = `tester${timestamp}@example.com`;
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Tester',
        email,
        password: '123456',
      })
      .expect(201);

    expect(response.body).toEqual({
      status: 'success',
      message: 'User created successfully',
      data: {
        id: expect.any(String),
        name: 'Tester',
        email,
        created_at: expect.any(String),
      },
    });
  });

  it('/auth/login (POST)', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    expect(response.body).toEqual({
      status: 'success',
      message: 'Login successful',
      data: {
        user_id: expect.any(String),
        access_token: expect.any(String),
        token_type: 'Bearer',
        expires_in: expect.any(Number),
      },
    });
  });
});
