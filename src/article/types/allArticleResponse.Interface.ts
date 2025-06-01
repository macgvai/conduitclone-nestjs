import { ArticleEntity } from '@app/article/entities/article.entity';

export interface allArticleResponseInterface {
  articles: ArticleEntity[];
  articlesCount: number;
}
