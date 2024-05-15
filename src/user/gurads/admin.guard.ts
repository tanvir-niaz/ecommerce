import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/cart/guards/cart.guard';
import { Reflector } from '@nestjs/core';



@Injectable()
export class JwtAdminAuthGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //perform the JWT authentication check
    const isJwtAuthValid = await super.canActivate(context);
    if (!isJwtAuthValid) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (user.roles !== 'admin') {
      throw new UnauthorizedException('Unauthorized access: Admin role required');
    }

    return true;
  }
}
