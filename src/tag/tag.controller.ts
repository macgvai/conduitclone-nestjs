import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { CreateTagDto } from '@app/tag/dto/create-tag.dto';
import { UpdateTagDto } from '@app/tag/dto/update-tag.dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
