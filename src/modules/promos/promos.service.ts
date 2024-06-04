/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { Promo } from './entities/promo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddPromoDto } from './dto/add-promo.dto';
import { User } from '../user/entities/user.entity';
import { error } from 'console';
import { User_promo_usage } from './entities/user_promo_usage';

@Injectable()
export class PromosService {

  constructor(
    @InjectRepository(Promo) private readonly promoRepository: Repository<Promo>, 
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(User_promo_usage) private readonly userPromoRepository:Repository<User_promo_usage>
  ) {}

  async create(createPromoDto: CreatePromoDto): Promise<object> {
    console.log(createPromoDto);
    let promo=await this.promoRepository.findOne({where:{code:createPromoDto.code}});
    if(promo){
      return{
        statusCode:HttpStatus.BAD_REQUEST,
        error:null,
        message:"You have already a promo with that name"
      }
    }
    promo=this.promoRepository.create({
      ...createPromoDto,
      validTill:new Date(createPromoDto.validTill),
    })

    await this.promoRepository.save(promo);

    return {
      statusCode: HttpStatus.CREATED,
      error: null,
      message: "Successfully created the promo"
    }
  }

  async addPromoByUser(addPromoDto: AddPromoDto, userId: number):Promise<object> {
    const user :User= await this.userRepository.findOne({
      where: { id: userId },
      relations: ['user_promo_usage', 'user_promo_usage.promo'], 
    });
    
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    
    const existingPromo = user.user_promo_usage.find(usage => usage.promo.id === addPromoDto.id);

    if (existingPromo) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Promo already added',
        message: `User already has a promo with the name ${addPromoDto.id}`
      };
    }
    const promoFind = await this.promoRepository.findOne({ where: {id:addPromoDto.id} });
    if (!promoFind) {
      throw new NotFoundException(`Promo with name ${addPromoDto.id} not found`);
    }
    const currentDate = new Date();
    if (currentDate > promoFind.validTill) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Promo expired',
        message: `Promo with name ${addPromoDto.id} has expired`
      };
    }

    const promoUsage=new User_promo_usage();
    promoUsage.promo=promoFind;
    promoUsage.user=user;
    await this.userPromoRepository.save(promoUsage);
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: `Promo added to user with id ${userId}`
    };
  }

  findAll() {
    return this.promoRepository.find();
  }

  async findOne(id: number) {
    const promo:Promo=await this.promoRepository.findOne({where:{id}});
    if(!promo){
      return{
        statusCode:HttpStatus.NOT_FOUND,
        error:null,
        message:"Promo not found by that id"
      }
    }
    return{
      statusCode:HttpStatus.ACCEPTED,
      error:null,
      data:promo,
      message:"Promo found"
    }
  }

  async update(id: number, updatePromoDto: UpdatePromoDto) :Promise<object>{
    let promo:Promo=await this.promoRepository.findOne({where:{id}});
    promo=Object.assign(promo,updatePromoDto);
    await this.promoRepository.save(promo);
    return{
      statusCode:HttpStatus.ACCEPTED,
      error:null,
      message:"Promo has been updated"
    }
  }

  async remove(id: number):Promise<Object> {
    const promo:Promo = await this.promoRepository.findOne({ where: { id } });
    if (!promo) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: "Not found the promo"
      }
    }
    await this.promoRepository.delete(id);
    await this.promoRepository.delete({name:promo.name});
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: "Successfully deleted the promo"
    }
  }
}
