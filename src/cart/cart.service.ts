import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private readonly cartRepository:Repository<Cart> ){}
  create(createCartDto: CreateCartDto,user_id:number) {
    // const product = this.productRepository.findOne({ where: { id: createCartDto.product_id } });

    // if (!product) {
    //   // Handle case where product is not found
    //   throw new Error(`Product with ID ${createCartDto.product_id} not found`);
    // }
    const cart = new Cart();
    cart.user_id = user_id;
    cart.product_id=createCartDto.product_id; 
    cart.product_quantity = createCartDto.quantity;

    return this.cartRepository.save(cart);
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(user_id: number) {
    return this.cartRepository.find({where:{user_id}});
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({where:{id}});
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    cart.product_quantity = updateCartDto.quantity; // Assuming quantity is the field to be updated
    return this.cartRepository.save(cart);
  }

  remove(id: number) {
    return this.cartRepository.delete(id);
  }
}
