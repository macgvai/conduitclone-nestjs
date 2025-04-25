import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { UserType } from '@app/user/types/user.type';
import { UserLoginInterface } from '@app/user/types/userLogin.interface';
import { UserLoginRespInterface } from '@app/user/types/userLoginResp.interface';
import { LoginUserDto } from '@app/user/dto/login-user.dto';

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
  async login(@Body('user') loginUserDto: LoginUserDto ): Promise<UserResponseInterface> {
    const user: UserEntity | null = await this.userService.login(loginUserDto);

    return this.userService.prepareUserResponse(user);
  }


}
