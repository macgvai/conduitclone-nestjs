import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { User } from '@app/user/decorators/user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') userName: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      userName,
    );


    return this.profileService.buildProfileResponse(profile);
  }
}
