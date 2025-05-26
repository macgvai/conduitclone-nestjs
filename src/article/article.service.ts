import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@app/user/entities/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import slugify from 'slugify';

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
      slug: this.getSlug(createArticleDto.title),
    });

    return this.articleRepository.save(article);
  }
  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article: ArticleEntity | null = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }
    return article;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
