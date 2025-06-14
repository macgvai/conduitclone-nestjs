import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { compare } from 'bcrypt';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import { UserLoginRespInterface } from '@app/user/types/userLoginResp.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = { errors: {} };

    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail) {
      errorResponse.errors['email'] = ['Email already exists'];
    }

    if (userByUsername) {
      errorResponse.errors['username'] = ['Username already exists'];
    }
    if (userByEmail || userByUsername) {
      throw new HttpException(
        errorResponse,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or password': ['Invalid email or password']
      }
    };

    const user: any = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });

    if (!user) {
      throw new HttpException(
        errorResponse,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordValid = await compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        errorResponse,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // user.password = '';
    // delete user.password;
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    // const user: UserEntity | null = await this.findById(id);
    //
    // if (!user) {
    //   throw new NotFoundException(`User with ID ${id} not found`);
    // }
    //
    // Object.assign(user, updateUserDto);

    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.userRepository.save(user);
  }

  findOne(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  generateJwt(user: UserEntity) {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
    );
  }

  prepareUserResponse(user: UserEntity): UserResponseInterface {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
