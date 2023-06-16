import { RepositoryOwner } from './github.models';

export interface GithubRepositoriesResponse {
  id: number;
  name: string;
  owner: RepositoryOwner;
  open_issues: number;
}

export interface GithubRepositoryData {
  githubId: number;
  name: string;
  owner: RepositoryOwner;
  openIssues: number;
  fetchedDate: Date;
}
