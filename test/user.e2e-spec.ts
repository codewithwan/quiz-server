import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (GET)', async () => {
    const user = await prisma.user.create({
      data: { name: 'Test User', email: 'test@example.com', password: 'password' },
    });

    const token = 'your-jwt-token'; // Replace with a valid JWT token

    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.id).toBe(user.id);
        expect(res.body.data.name).toBe('Test User');
      });
  });

  it('/user/update-name (POST)', async () => {
    const user = await prisma.user.create({
      data: { name: 'Test User', email: 'test@example.com', password: 'password' },
    });

    const token = 'your-jwt-token'; // Replace with a valid JWT token

    return request(app.getHttpServer())
      .post('/user/update-name')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.name).toBe('New Name');
      });
  });
});
