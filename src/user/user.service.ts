import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
   constructor(@InjectRepository(User) private readonly userRepositoty:Repository<User>){

   }
   async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepositoty.findOne({ where:{email: createUserDto.email} });

    if (existingUser) {
        // throw new Error('Duplicate email found');
        return { message: 'Duplicate email found' };
    }

    // If email doesn't exist, proceed with creating the user
    const user:CreateUserDto = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;

    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
    user.password = hashPassword;

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
    return `This action removes a #${id} user`;
  }
}
