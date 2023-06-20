import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'test' })
  async updateRepositoriesData() {
    const updatedData = await this.githubService.getRepositoriesData();
    const updatedRepositories = [];
    for (const repository of updatedData) {
      const updatedRepository =
        await this.githubService.updateOrCreateRepository(repository);
      updatedRepositories.push(updatedRepository);
    }
    return updatedRepositories;
  }
}
