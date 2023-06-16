import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export class RepositoryOwner {
  @prop()
  name: string;

  @prop()
  githubId: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GithubRepositoryModel extends Base {}
export class GithubRepositoryModel extends TimeStamps {
  @prop()
  githubId: number;

  @prop()
  name: string;

  @prop({ type: () => [RepositoryOwner] })
  owner: RepositoryOwner;

  @prop()
  openIssues: number;

  @prop()
  fetchedDate: Date;
}
