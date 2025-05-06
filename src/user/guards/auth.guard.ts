import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const request: ExpressRequestInterface = context.switchToHttp().getRequest();
    if (request.user) {
      return true;
    }
    throw  new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
