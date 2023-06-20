import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { API_URL } from './github.contants';

import { ModelType } from '@typegoose/typegoose/lib/types';
import { AxiosError } from 'axios';
import { InjectModel } from 'nestjs-typegoose';
import {
  GithubRepositoriesResponse,
  GithubRepositoryData,
} from './github.classes';
import { GithubRepositoryModel } from './github.models';

@Injectable()
export class GithubService {
  constructor(
    @InjectModel(GithubRepositoryModel)
    private readonly githubRepositoryModel: ModelType<GithubRepositoryModel>,
    private readonly httpService: HttpService,
  ) {}
  async findRepository(githubId: number): Promise<GithubRepositoryModel> {
    return await this.githubRepositoryModel.findOne({ githubId }).exec();
  }

  async updateOrCreateRepository(repository: GithubRepositoryData) {
    const { githubId } = repository;
    const existedRepository = await this.findRepository(githubId);

    if (existedRepository) {
      return await this.githubRepositoryModel
        .findOneAndUpdate({ githubId }, repository)
        .exec();
    }

    return this.githubRepositoryModel.create(repository);
  }

  async getRepositoriesData() {
    try {
      const url = API_URL.USER_REPOSITORIES('cho0op');

      const response = await firstValueFrom(
        this.httpService.get<GithubRepositoriesResponse[]>(url),
      );
      return this.parseRepositoriesData(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(error.response.data, error.response.status);
      }
    }
  }

  private parseRepositoriesData(
    data: GithubRepositoriesResponse[],
  ): GithubRepositoryData[] {
    return data.map(({ name, id, owner, open_issues }) => {
      return {
        name,
        githubId: id,
        owner: {
          name: owner.login,
          githubId: owner.id,
        },
        openIssues: open_issues,
        fetchedDate: new Date(),
      };
    });
  }
}
