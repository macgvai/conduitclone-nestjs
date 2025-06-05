import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import { ProfileType } from '@app/profile/types/profile.type';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    public userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(currentUserId: number, userName: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      ...user,
      following: false,
    };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    const { email, bio, ...profileWithoutEmail } = profile;
    return {
      profile: {
        ...profileWithoutEmail,
        biography: profile.bio,
      }
    };
  }
}
