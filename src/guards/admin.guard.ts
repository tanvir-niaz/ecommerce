import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/user.guard';


@Injectable()
export class JwtAdminAuthGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJwtAuthValid = await super.canActivate(context);
    if (!isJwtAuthValid) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (user.roles !== 'admin') {
      throw new UnauthorizedException();
    }

    return true;
  }
}
