import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { BeforeInsert } from 'typeorm';
import { hash } from 'bcrypt';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  readonly username: string;
  readonly email: string;
  readonly bio: string;
  readonly image: string;
}
