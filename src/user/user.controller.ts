import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import { User } from '@app/user/decorators/user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async create(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.create(createUserDto);

    return this.userService.prepareUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user: UserEntity | null = await this.userService.login(loginUserDto);

    return this.userService.prepareUserResponse(user);
  }

  @Get('user')
  @UsePipes(new ValidationPipe())
  async currentUser(
    @User('id') user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.prepareUserResponse(user);
  }
}
