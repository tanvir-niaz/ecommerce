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
            usernameField: 'email' // Specify email as the username field
        });
        
    }
    async validate(email: string, password: string): Promise<User> {
        
        const user: User = await this.userService.getUserByUserEmail(email);

        console.log(user);
        // If user doesn't exist, throw UnauthorizedException
        if (!user) {
          throw new UnauthorizedException('Invalid email');
        }
    
        // Compare password asynchronously
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        // If password is invalid, throw UnauthorizedException
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid password');
        }
    
        // If email and password are valid, return user
        return user;
      }
}