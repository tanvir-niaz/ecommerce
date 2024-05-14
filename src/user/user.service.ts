import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
   constructor(@InjectRepository(User) private readonly userRepositoty:Repository<User>,private mailerService:MailerService,private readonly configService:ConfigService){

   }
   async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepositoty.findOne({ where:{email: createUserDto.email} });

    if (existingUser) {
        // throw new Error('Duplicate email found');
        return { message: 'Duplicate email found' };
    }

    const user:CreateUserDto = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    const saltOrRounds=Number(this.configService.get<number>("saltOrRounds"))
    const hashPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
    user.password = hashPassword;
    user.roles=createUserDto.roles;

    // Save the user to the database
    const { name, email } = await this.userRepositoty.save(user);
    return { name, email };
}


  findAll() {
    return this.userRepositoty.find();
  }

  findOne(id: number) {
    return this.userRepositoty.findOne({where:{id}});
  }

  async getUserByUserEmail(email:string){
    
    return this.userRepositoty.findOne({where:{email}});

  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userRepositoty.delete(id);
  }

  async passwordRecovery(email:string){
    const token:string= crypto.randomBytes(Math.ceil(12 / 2)).toString('hex').slice(0, 12);
    const user=await this.userRepositoty.findOne({where:{email}});
    user.token=token;
    // console.log(user);
    this.userRepositoty.save(user);

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
    const userByToken=await this.userRepositoty.findOne({where:{token:resetPasswordDto.token}})
    if(resetPasswordDto.password!==resetPasswordDto.confirm_password){
      throw new BadRequestException("Passwords dont match");
    }
    if(userByToken){
      const saltOrRounds=Number(this.configService.get<number>("saltOrRounds"))
      const hashPassword = await bcrypt.hash(resetPasswordDto.password, saltOrRounds);
      userByToken.password=hashPassword;
      userByToken.token="";
      this.userRepositoty.save(userByToken);
      
      return "Successfully reset the password";
    }
    else{
      throw new BadRequestException("Token not valid");
    }
  }

}
