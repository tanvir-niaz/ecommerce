import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport-local";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService:UserService){
        super({
            usernameField: 'email' 
        });
        
    }
    async validate(email: string, password: string): Promise<User> {
        
        const user: User = await this.userService.getUserByUserEmail(email);

        // console.log(user);
        
        if (!user) {
          throw new UnauthorizedException('Invalid email');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid password');
        }
        return user;
      }
}