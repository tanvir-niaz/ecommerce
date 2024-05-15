import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository:Repository<Order>,
  @InjectRepository(Cart) private readonly cartRepository:Repository<Cart>,
  @InjectRepository(Product) private readonly productRepository:Repository<Product>
){}


async create(createOrderDto: CreateOrderDto, userId: number) {
  const userCartItems: Cart[] = await this.cartRepository.find({ where: { user_id: userId } });


  const orders = await this.orderRepository.save(userCartItems.map(cartItem => {
    const order = new Order();
    order.user_id = cartItem.user_id;
    order.product_id = cartItem.product_id;
    order.cart_id=cartItem.id;
    
    return order;
  }));


  for (const cartItem of userCartItems) {
    const product = await this.productRepository.findOne({where:{id:cartItem.product_id}});
    if (product) {
      product.stockQuantity -= cartItem.product_quantity;
      await this.productRepository.save(product);
    }
  }

  await this.cartRepository.remove(userCartItems);

  return orders;
}

  findAll() {
    return `This action returns all order`;
  }

  findOrdersByUserId(id: number) {
    return this.orderRepository.find({where:{user_id:id}});
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
