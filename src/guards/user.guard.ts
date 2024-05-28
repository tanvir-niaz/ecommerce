import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
     
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      throw new UnauthorizedException('');
    }
    
    const tokenWithoutBearer = token.slice(7);
    let decodedToken: any;
    try {
      decodedToken = this.jwtService.verify(tokenWithoutBearer,{secret:this.configService.get<string>('secret_key')});
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decodedToken.id;
    
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (
      decodedToken.name !== user.name ||
      decodedToken.email !== user.email ||
      decodedToken.password!==user.password
    ) {
      throw new UnauthorizedException();
    }
    
    request.user = user;
    if(decodedToken.roles=="admin" ){
      return request.user;
    }
    return request.user;
  }
}
