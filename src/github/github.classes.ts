export class GithubRepositoriesResponse {
  id: number;
  name: string;
  owner: {
    login: string;
    id: number;
  };
  open_issues: number;
}

export class GithubRepositoryOwner {
  githubId: number;
  name: string;
}

export class GithubRepositoryData {
  githubId: number;
  name: string;
  owner: GithubRepositoryOwner;
  openIssues: number;
  fetchedDate: Date;
}
