import { UserEntity } from '@app/user/entities/user.entity';

export type UserLoginRespInterface = Partial<UserEntity> & {
  password?: string;
};
