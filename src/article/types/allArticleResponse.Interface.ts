import { ArticleType } from '@app/article/types/article.type';

export interface allArticleResponseInterface {
  articles: ArticleType[];
  articlesCount: number;
}
