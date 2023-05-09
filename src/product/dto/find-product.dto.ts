import { TopLevelCategory } from '../../top-page/top-page.model';

export class FindProductDto {
  firstCategory: TopLevelCategory;
  limit: number;
}
