import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { use } from 'passport';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository:Repository<Order>,
  @InjectRepository(Cart) private readonly cartRepository:Repository<Cart>,
  @InjectRepository(Product) private readonly productRepository:Repository<Product>,
  @InjectRepository(User) private readonly userRepository:Repository<User>,
  @InjectRepository(OrderItem) private readonly orderItemRepository:Repository<Order>,
  @InjectRepository(CartItem) private readonly cartItemRepository:Repository<Cart>
){}
async createOrder(userId: number): Promise<void> {
  const cart = await this.cartRepository.findOne({ 
    where: { user: { id: userId } }, 
    relations: ['items', 'items.product', 'user'] 
  });

  if (!cart) {
    throw new NotFoundException('Cart not found for the user');
  }
  if(cart.items.length==0){
    throw new NotFoundException("Nothing in cart");
  }

  const totalPrice = cart.items.reduce((total, cartItem) => {
    return total + (cartItem.product.price * cartItem.quantity);
  }, 0);


  // Create a new order entity
  const order = new Order();
  order.user = cart.user;
  order.totalPrice = totalPrice;
  console.log()
  

  // Create order items for each cart item
  const orderItems = cart.items.map(cartItem => {
    const orderItem = new OrderItem();
    orderItem.order = order;
    // orderItem.product = cartItem.product;
    orderItem.quantity = cartItem.quantity;
    orderItem.productDetails=cartItem.product;
    // orderItem.price = cartItem.product.price;

    return orderItem;
  });

  // Save the order and order items to the database
  await this.orderRepository.save(order);
  await this.orderItemRepository.save(orderItems);

  // Delete cart items first
  await this.cartItemRepository.softRemove(cart.items);

  // Now that the order and order items are saved, delete the cart
  // await this.cartRepository.remove(cart);
}

  async getPreviousOrders(userId: number): Promise<Order[]> {
    // Query orders associated with the user ID and eagerly load the products
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'], // Ensure products are eagerly loaded
    });
  
    return orders;
  }
}