import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect, Types } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { INVALID_ID_ERROR } from '../src/pipes/pipes.constants';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toString('hex');
const nonExistentProductId = new Types.ObjectId().toString('hex');

const testDto: CreateReviewDto = {
  name: 'test',
  title: 'test',
  descriptions: 'test',
  rating: 2,
  productId,
};

const loginDto: AuthDto = {
  login: 'asdasd12@gmail.com',
  password: '111111',
};

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    accessToken = body.access_token;
  });

  it('/review/create (POST) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201);

    createdId = body._id;
    expect(createdId).toBeDefined();
  });

  it('/review/create (POST) - fail validation', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 10 })
      .expect(400);

    expect(body.message).toBeDefined();
  });

  it('/review/byProduct/:productId (GET) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200);

    expect(body.length).toBe(1);
  });

  it('/review/byProduct/:productId (GET) - fail', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/review/byProduct/${nonExistentProductId}`)
      .expect(200);

    expect(body.length).toBe(0);
  });

  it('/review/:id (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/review/:id (DELETE) - invalid id', async () => {
    const { body } = await request(app.getHttpServer())
      .delete(`/review/${createdId + '123'}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);

    expect(body.message).toBe(INVALID_ID_ERROR);
  });

  it('/review/:id (DELETE) - fail', async () => {
    await request(app.getHttpServer())
      .delete(`/review/${nonExistentProductId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND });
  });

  afterAll(() => {
    disconnect();
  });
});
