import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '@app/tag/dto/create-tag.dto';
import { UpdateTagDto } from '@app/tag//dto/update-tag.dto';

@Injectable()
export class TagService {
  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  findAll(): string[] {
    return ['dragon', 'rainbow'];
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
