import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";


@Injectable()
export class AuthService{
    
    constructor(
        // @Inject(forwardRef(()=>UserService))
        private readonly userService:UserService,
        private readonly jwtService:JwtService){

    }
    //id card
    generateToken(payload:User)
    {
        console.log("payload",payload)
        return this.jwtService.sign(JSON.parse(JSON.stringify(payload)));
    }
}