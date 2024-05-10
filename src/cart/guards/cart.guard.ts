import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
 // Import your user service
// import { User } from './user.entity'; // Import your user entity
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
     // Inject your user service
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    // console.log(token)
    if (!token || !token.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token not provided');
    }
    
    const tokenWithoutBearer = token.slice(7);
    console.log(tokenWithoutBearer)
    let decodedToken: any;
    try {
      decodedToken = this.jwtService.verify(tokenWithoutBearer,{secret:this.configService.get<string>('secret_key')});
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    // Extract user ID from the decoded token
    const userId = decodedToken.id;
    
    // Fetch user from the database based on the user ID
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Compare relevant fields from the decoded token with the corresponding fields in the user record
    if (
      decodedToken.name !== user.name ||
      decodedToken.email !== user.email ||
      decodedToken.password!==user.password
    ) {
      throw new UnauthorizedException('Token data does not match user data');
    }

    // You can perform additional checks here based on your requirements

    // Attach the user object to the request for further processing if needed
    request.user = user;

    return true;
  }
}
