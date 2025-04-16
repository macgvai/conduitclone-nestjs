import { Module } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { TagController } from '@app/tag/tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@app/tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
