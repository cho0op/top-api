import { INestApplication } from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '../src/app.module';

import { CreateTopPageDto } from '../src/top-page/dto/create-top-page.dto';

import { AuthDto } from '../src/auth/dto/auth.dto';
import { FindTopPageDto } from '../src/top-page/dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND_ERROR } from '../src/top-page/top-page.constants';

const loginDto: AuthDto = {
  login: 'asdasd12@gmail.com',
  password: '111111',
};
const alias = 'book';
const topPageTestDto: CreateTopPageDto = {
  firstCategory: 1,
  secondCategory: 'test sec cat',
  title: 'Books',
  category: 'book',
  alias: alias,
  advantages: [
    {
      title: 'good',
      description: 'very good',
    },
  ],
  seoText: 'asd',
  tagsTitle: ['book', 'it'],
  tags: ['book', 'it'],
};

const findTopPageDto: FindTopPageDto = {
  firstCategory: 1,
};

const findEmptyTopPageDto: FindTopPageDto = {
  firstCategory: 2,
};

describe('TopPageController (e2e)', () => {
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

  it('/top-page/create (POST) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/top-page/create')
      .send(topPageTestDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    createdId = body._id;
    expect(createdId).toBeDefined();
  });

  it('/top-page/find (POST) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/top-page/find')
      .send(findTopPageDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(body).toBeDefined();
    expect(body).toHaveLength(1);
    expect(body[0].alias).toBe(alias);
  });

  it('/top-page/find (POST) - empty response', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/top-page/find')
      .send(findEmptyTopPageDto)
      .expect(200);

    expect(body).toHaveLength(0);
  });

  it('/top-page/byAlias/:alias (POST) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/top-page/byAlias/${alias}`)
      .expect(200);

    expect(body.alias).toBe(alias);
  });

  it('/top-page/byAlias/:alias (POST) - empty response', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/top-page/byAlias/wrong-alias}`)
      .expect(404);

    expect(body.message).toBe(TOP_PAGE_NOT_FOUND_ERROR);
  });

  it('/top-page/:id (PATCH) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .patch(`/top-page/${createdId}`)
      .send({ ...topPageTestDto, seoText: 'new seo' })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(body.seoText).toBe('new seo');
  });

  it('/top-page/:id (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .delete(`/top-page/${createdId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
