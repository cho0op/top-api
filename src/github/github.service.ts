import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { API_URL } from './github.contants';

import {
  GithubRepositoriesResponse,
  GithubRepositoryData,
} from './github.classes';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}
  async getData() {
    try {
      const url = API_URL.USER_REPOSITORIES('cho0op');

      const response = await firstValueFrom(
        this.httpService.get<GithubRepositoriesResponse[]>(url),
      );

      return this.parseData(response.data);
    } catch (error) {
      Logger.error(error);
    }
  }

  private parseData(
    data: GithubRepositoriesResponse[],
  ): GithubRepositoryData[] {
    return data.map(({ name, id, owner, open_issues }) => {
      return {
        name,
        githubId: id,
        owner,
        openIssues: open_issues,
        fetchedDate: new Date(),
      };
    });
  }
}
