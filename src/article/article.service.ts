import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '@app/user/entities/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import slugify from 'slugify';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateArticleDto } from '@app/article/dto/updateArticle.dto';
import { allArticleResponseInterface } from '@app/article/types/allArticleResponse.Interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    public articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    public userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async getAllArticles(currentUserId: number, query: any): Promise<allArticleResponseInterface> {
    // const queryBuilder = this.dataSource.getRepository(ArticleEntity).createQueryBuilder('articles')
    //
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount: number = await queryBuilder.getCount();


    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author},
      })
      if (!author) {
        throw new NotFoundException(`Author with username "${query.author}" not found`);
      }

      queryBuilder.andWhere('author.authorId = :id', { id: author.id });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    // if (query.favorited) {
    //   const favoritedArticle = await this.articleRepository.findOne({
    //     where: { author: { username: `%${query.favorited}%` } },
    //   });
    // }


    return {
      articles: await queryBuilder.getMany(),
      articlesCount: articlesCount,
    };
  }

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

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not an author of this article',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not an author of this article',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
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
