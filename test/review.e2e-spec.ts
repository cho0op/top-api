import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect, Types } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
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

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST)', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201);

    createdId = body._id;
    expect(createdId).toBeDefined();
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
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', async () => {
    await request(app.getHttpServer())
      .delete(`/review/${nonExistentProductId}`)
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND });
  });

  afterAll(() => {
    disconnect();
  });
});
