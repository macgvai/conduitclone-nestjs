import { Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/entities/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    public articleRepository: Repository<ArticleEntity>,
  ) {}

  // async createArticle(
  //   currentUser: UserEntity,
  //   createArticleDto: CreateArticleDto,
  // ): Promise<ArticleEntity> {
  //   const article = new ArticleEntity();
  //
  //   Object.assign(article, createArticleDto);
  //
  //   if (!article.tagList) {
  //     article.tagList = [];
  //   }
  //   article.slug = article.title;
  //   article.author = currentUser;
  //
  //   return await this.articleRepository.save(article);
  // }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      tagList: createArticleDto.tagList ?? [],
      author: currentUser,
      slug: createArticleDto.title,
    });

    return this.articleRepository.save(article);
  }
}
