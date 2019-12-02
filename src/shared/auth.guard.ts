import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    request.user = await this.validateRequest(request.headers.authorization);

    return true;
  }

  async validateRequest(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    const token = auth.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);

      return decoded;
    } catch (err) {
      const message = `Token error: ${err}`;

      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}
