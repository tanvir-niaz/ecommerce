import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport-local";

import * as bcrypt from 'bcrypt';
import { UserService } from "src/modules/user/user.service";
import { User } from "src/modules/user/entities/user.entity";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService:UserService){
        super({
            usernameField: 'email' 
        });
        
    }
    async validate(email: string, password: string): Promise<User> {
        const user: User = await this.userService.getUserByUserEmail(email);   
        if (!user) {
          throw new UnauthorizedException('Invalid email/password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid password/password');
        }
        return user;
      }
}