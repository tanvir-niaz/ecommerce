import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { Promo } from './entities/promo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { error } from 'console';
import { AddPromoDto } from './dto/add-promo.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PromosService {

  constructor(@InjectRepository(Promo) private readonly promoRepository:Repository<Promo>, @InjectRepository(User) private readonly userRepository:Repository<User>){}

  async create(createPromoDto: CreatePromoDto):Promise<object> {
    await this.promoRepository.save(createPromoDto);
    return{
      statusCode:HttpStatus.CREATED,
      error:null,
      message:"Successfully created the promo"
    }
  }

  async addPromoByUser(addPromoDto: AddPromoDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['promos']
    });
  
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const existingPromo = user.promos.find(promo => promo.name === addPromoDto.name);
  
    if (existingPromo) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Promo already added',
        message: `User already has a promo with the name ${addPromoDto.name}`
      };
    }

    const promoFind = await this.promoRepository.findOne({ where: { name: addPromoDto.name } });
  
    if (!promoFind) {
      throw new NotFoundException(`Promo with name ${addPromoDto.name} not found`);
    }
    const promo = new Promo();
    promo.name = addPromoDto.name;
    promo.user = user;
    promo.discount = promoFind.discount;
  
    await this.promoRepository.save(promo);
  
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: `Promo added to user with id ${userId}`
    };
  }
  
  findAll() {
    return this.promoRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} promo`;
  }

  update(id: number, updatePromoDto: UpdatePromoDto) {
    return `This action updates a #${id} promo`;
  }

  
  async remove(id: number) {
    const promo=await this.promoRepository.find({where:{id}})
    if(!promo){
      return {
        statusCode:HttpStatus.NOT_FOUND,
        error:"Not found the promo"
      }
    }
    await this.promoRepository.delete(id);
    return{
      statusCode:HttpStatus.OK,
      error:null,
      message:"Successfully deleted the promo"
    }
  }
}
