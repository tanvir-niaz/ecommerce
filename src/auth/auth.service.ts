import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, ConflictException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from "./dto/create-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.sto";
import { User } from "src/modules/user/entities/user.entity";


@Injectable()
export class AuthService{
    
    constructor(
        // private readonly userService:UserService,
        private readonly jwtService:JwtService,@InjectRepository(User) private readonly userRepository:Repository<User>,private mailerService:MailerService,private readonly configService:ConfigService){

    }
    generateToken(payload:User)
    {
        // console.log("payload",payload)
        return this.jwtService.sign(JSON.parse(JSON.stringify(payload)));
    }
    async createUser(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({ where:{email: createUserDto.email} });
    
        if (existingUser) {
            // throw new Error('Duplicate email found');
            // return { message: 'Duplicate email found' ,status:400};
            throw new ConflictException("Duplicate email found")
        }
    
        const user:CreateUserDto = new User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        const saltOrRounds=Number(this.configService.get<number>("saltOrRounds"))
        const hashPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
        user.password = hashPassword;
        user.roles=createUserDto.roles;
    
        const { name, email } = await this.userRepository.save(user);
        return { name, email };
    }


    async passwordRecovery(email:string){
        const token:string= crypto.randomBytes(Math.ceil(12 / 2)).toString('hex').slice(0, 12);
        const user=await this.userRepository.findOne({where:{email}});
        user.token=token;
        // console.log(user);
        this.userRepository.save(user);
    
        const url=`http://localhost:3000/reset/${token}`;
        await this.mailerService.sendMail({
          to:email,
          subject:"Reset Password token",
          html:`Click <a href="${url}">here </a> to reset your passworsd`
        });
        return{
          message:"Please check your mail"
        }
      }
    
      async resetPassword(resetPasswordDto:ResetPasswordDto){
        const userByToken=await this.userRepository.findOne({where:{token:resetPasswordDto.token}})
        if(resetPasswordDto.password!==resetPasswordDto.confirm_password){
          throw new BadRequestException("Passwords dont match");
        }
        if(userByToken){
          const saltOrRounds=Number(this.configService.get<number>("saltOrRounds"));
          const hashPassword = await bcrypt.hash(resetPasswordDto.password, saltOrRounds);
          userByToken.password=hashPassword;
          userByToken.token="";
          this.userRepository.save(userByToken);
          
          return "Successfully reset the password";
        }
        else{
          throw new BadRequestException("Token not valid");
        }
      }
}