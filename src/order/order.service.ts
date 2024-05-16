import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository:Repository<Order>,
  @InjectRepository(Cart) private readonly cartRepository:Repository<Cart>,
  @InjectRepository(Product) private readonly productRepository:Repository<Product>,
  @InjectRepository(User) private readonly userRepository:Repository<User>,
  @InjectRepository(OrderItem) private readonly orderItemRepository:Repository<Order>
){}
async createOrder(userId: number): Promise<void> {
  // Retrieve the cart associated with the user
  const cart = await this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['items', 'items.product'] });


  if (!cart) {
    throw new NotFoundException('Cart not found for the user');
  }

  // Calculate total price of the order
  const totalPrice = cart.items.reduce((total, cartItem) => {
    return total + (cartItem.product.price * cartItem.quantity);
  }, 0);

  // Create a new order entity
  const order = new Order();
  order.user = cart.user;
  order.totalPrice = totalPrice;

  // Create order items for each cart item
  const orderItems = cart.items.map(cartItem => {
    const orderItem = new OrderItem();
    orderItem.order = order;
    orderItem.product = cartItem.product;
    orderItem.quantity = cartItem.quantity;
    // orderItem.= cartItem.product.price;
    return orderItem;
  });

  // Save the order and order items to the database
  await this.orderRepository.save(order);
  await this.orderItemRepository.save(orderItems);
  }

  // async getPreviousOrders(userId: number): Promise<Order[]> {
  //   // Query orders associated with the user and eagerly load the products
  //   const orders = await this.orderRepository.find({ where: { user: { id: userId } },
  //     relations: ['products'] // Specify the relationship to be loaded
  //   });
  
  //   return orders;
  // }
}