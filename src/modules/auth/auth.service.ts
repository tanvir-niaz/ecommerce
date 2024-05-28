import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from "./dto/create-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.sto";
import { User } from "src/modules/user/entities/user.entity";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";


@Injectable()
export class AuthService{
    
    constructor(
        private readonly jwtService:JwtService,@InjectRepository(User) private readonly userRepository:Repository<User>,private mailerService:MailerService,private readonly configService:ConfigService){

    }
    generateToken(user:User):string
    {
        const { id, name, email, password, roles } = user;
        const payload = { id, name, email, password, roles };
        return this.jwtService.sign(JSON.parse(JSON.stringify(payload)));
    }
    async createUser(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({ where:{email: createUserDto.email} });
    
        if (existingUser) {
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


    async passwordRecovery(forgotPasswordDto:ForgotPasswordDto){
        const token:string= crypto.randomBytes(Math.ceil(12 / 2)).toString('hex').slice(0, 12);
        const {email}=forgotPasswordDto;
        const user=await this.userRepository.findOne({where:{email}});
        user.token=token;
        // console.log(user);
        this.userRepository.save(user);
    
        const url=`http://localhost:3000/auth/reset-password/${token}`;
        await this.mailerService.sendMail({
          to:email,
          subject:"Reset Password token",
          html:`Click <a href="${url}">here </a> to reset your passworsd`
        });
        return{
          status:HttpStatus.ACCEPTED,
          error:null,
          message:"Please check your mail"
        }
      }
    
      async resetPassword(resetPasswordDto:ResetPasswordDto,token:string){
        const userByToken=await this.userRepository.findOne({where:{token:token}})
        if(resetPasswordDto.password!==resetPasswordDto.confirm_password){
          throw new BadRequestException("Passwords dont match");
        }
        if(userByToken){
          const saltOrRounds=Number(this.configService.get<number>("saltOrRounds"));
          const hashPassword = await bcrypt.hash(resetPasswordDto.password, saltOrRounds);
          userByToken.password=hashPassword;
          userByToken.token="";
          this.userRepository.save(userByToken);
          
          return {statusCode:HttpStatus.OK,error:null,message:"Successfully reset the password"};
        }
        else{
          throw new BadRequestException("Token not valid");
        }
      }
}