import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import { ProfileType } from '@app/profile/types/profile.type';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    public userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    public followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    })

    return {
      ...user,
      following: Boolean(follow),
    };
  }

  async followProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.id === currentUserId) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
      // await this.followRepository.save({
      //   followerId: currentUserId,
      //   followingId: user.id,
      // });
    }

    return {
      ...user,
      following: true,
    };
  }

  async unfollowProfile(
    currentUserId: number,
    userName: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.id === currentUserId) {
      throw new HttpException(
        'You cannot unfollow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });

    return {
      ...user,
      following: false,
    };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    const { email, bio, ...profileRest } = profile;
    return {
      profile: {
        ...profileRest,
        biography: profile.bio,
      },
    };
  }
}
