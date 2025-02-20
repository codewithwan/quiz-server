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

    expect(response.body).toHaveProperty('id');
    expect(response.body.data).toEqual({
      name: 'Tester',
      email,
    });
    expect(response.body).toHaveProperty('created_at');
  });
});
