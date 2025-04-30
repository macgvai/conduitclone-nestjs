import { UserEntity } from '@app/user/entities/user.entity';
import { Request } from 'express';

export interface ExpressRequestInterface extends Request {
  user: UserEntity | null;
}