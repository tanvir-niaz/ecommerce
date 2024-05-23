import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from '../auth/dto/update-user.dto';



@Injectable()
export class UserService {
   constructor(@InjectRepository(User) private readonly userRepositoty:Repository<User>,private readonly configService:ConfigService){
   }

  findAll() {
    return this.userRepositoty.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user: User | null = await this.userRepositoty.findOne({ where: { id } });
    if(!user){
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
    }
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

}
