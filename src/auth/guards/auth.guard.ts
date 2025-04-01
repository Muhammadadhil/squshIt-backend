import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    console.log('token from cookiess:', token);

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const decoded = this.jwtService.decode(token);
      console.log('Decoded Payload:', decoded);

      const token1 = await this.jwtService.signAsync({ id: '123' });
      console.log('token1:', token1);
      const verifiedPayload = await this.jwtService.verifyAsync(token1);
      console.log('Verified Payload:', verifiedPayload);

      const payload = await this.jwtService.verifyAsync(token);
      console.log('payload:', payload);
      request['user'] = payload;
      return true;
    } catch (error) {
      console.log('guard error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    console.log('req.coookeis:', request.cookies);
    return request.cookies?.access_token as string | undefined;
  }
}
