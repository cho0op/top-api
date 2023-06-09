import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INVALID_LOGIN_DATA } from '../src/auth/auth.contants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const validLoginDto: AuthDto = {
  login: 'asdasd12@gmail.com',
  password: '111111',
};

const wrongPasswordLoginDto: AuthDto = {
  login: 'asdasd12@gmail.com',
  password: '222222',
};

const invalidLoginDto: any = {
  asd: 123,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(validLoginDto)
      .expect(200);

    expect(body.access_token).toBeDefined();
  });

  it('/auth/login (POST) - fail', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(wrongPasswordLoginDto)
      .expect(401);

    expect(body.access_token).toBeUndefined();
    expect(body.message).toBe(INVALID_LOGIN_DATA);
  });

  it('/auth/login (POST) - fail validation', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(invalidLoginDto)
      .expect(400);

    expect(body.access_token).toBeUndefined();
    expect(body.message.length).toBe(2);
  });

  afterAll(() => {
    disconnect();
  });
});
