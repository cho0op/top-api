import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { API_URL } from './github.contants';
import { GithubRepositoriesResponse } from './github.models';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}
  async getData() {
    try {
      const url = API_URL.USER_REPOSITORIES('cho0op');

      const response = await firstValueFrom(
        this.httpService.get<GithubRepositoriesResponse>(url),
      );
      console.log('response', response);
    } catch (error) {
      Logger.error(error);
    }
  }
}
