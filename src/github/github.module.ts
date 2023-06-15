import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  providers: [GithubService],
  imports: [HttpModule],
  controllers: [GithubController],
})
export class GithubModule {}
