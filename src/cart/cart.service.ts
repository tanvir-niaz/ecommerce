import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private readonly cartRepositoty:Repository<Cart>){}
  create(createCartDto: CreateCartDto) {
    let  cart=new Cart();
    cart=this.cartRepositoty.create(createCartDto);
    return this.cartRepositoty.save(createCartDto);
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(user_id: number) {
    return this.cartRepositoty.find({where:{user_id}});
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
