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

@Injectable()
export class PromosService {

  constructor(
    @InjectRepository(Promo) private readonly promoRepository: Repository<Promo>, 
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(createPromoDto: CreatePromoDto): Promise<object> {
    console.log(createPromoDto);
    let promo=await this.promoRepository.findOne({where:{name:createPromoDto.name}});
    if(promo){
      return{
        statusCode:HttpStatus.BAD_REQUEST,
        error:null,
        message:"You have already a promo with that name"
      }
    }
    promo=this.promoRepository.create({
      ...createPromoDto,
      validTill:new Date(createPromoDto.validTill)
    })

    await this.promoRepository.save(promo);

    return {
      statusCode: HttpStatus.CREATED,
      error: null,
      message: "Successfully created the promo"
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
    console.log(addPromoDto);

    if (!promoFind) {
      console.log("hjello");
      throw new NotFoundException(`Promo with name ${addPromoDto.name} not found`);
    }
    const currentDate = new Date();
    if (currentDate > promoFind.validTill) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Promo expired',
        message: `Promo with name ${addPromoDto.name} has expired`
      };
    }
    const promo = new Promo();
    promo.name = addPromoDto.name;
    promo.user = user;
    promo.discount = promoFind.discount;
    promo.validTill= promoFind.validTill;
    console.log(promo.isAvailed);

    if (promo.isAvailed === undefined) {
      await this.promoRepository.save(promo);
    }
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
    const promo=await this.promoRepository.findOne({where:{id}});
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

  async update(id: number, updatePromoDto: UpdatePromoDto) {
    let promo=await this.promoRepository.findOne({where:{id}});
    promo=Object.assign(promo,updatePromoDto);
    await this.promoRepository.save(promo);
    return{
      statusCode:HttpStatus.ACCEPTED,
      error:null,
      message:"Promo has been updated"
    }
  }

  async remove(id: number) {
    const promo = await this.promoRepository.findOne({ where: { id } });
    if (!promo) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: "Not found the promo"
      }
    }
    await this.promoRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: "Successfully deleted the promo"
    }
  }
}
