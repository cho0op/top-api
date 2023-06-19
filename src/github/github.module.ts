import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { GithubController } from './github.controller';
import { GithubRepositoryModel } from './github.models';
import { GithubService } from './github.service';

@Module({
  providers: [GithubService],
  imports: [
    HttpModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: GithubRepositoryModel,
        schemaOptions: {
          collection: 'GithubRepository',
        },
      },
    ]),
  ],
  controllers: [GithubController],
})
export class GithubModule {}
