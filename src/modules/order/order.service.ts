import {Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OrderService {
  constructor(private mailerService:MailerService,@InjectRepository(Order) private readonly orderRepository:Repository<Order>,
  @InjectRepository(Cart) private readonly cartRepository:Repository<Cart>,
  @InjectRepository(Product) private readonly productRepository:Repository<Product>,
  @InjectRepository(User) private readonly userRepository:Repository<User>,
  @InjectRepository(OrderItem) private readonly orderItemRepository:Repository<Order>,
  @InjectRepository(CartItem) private readonly cartItemRepository:Repository<Cart>,
  
){}
async createOrder(createOrderDto:CreateOrderDto,userId: number): Promise<string> {
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

  const totalPrice =cart.items.reduce((total, cartItem) => {
    return total + (cartItem.product.price * cartItem.quantity);
  }, 0);


  
  const order = new Order();
  order.user = cart.user;
  order.cartId=cart.id;
  order.totalPrice = totalPrice;
  order.shipping_address=createOrderDto.shipping_address;
  console.log()
  

  // Create order items for each cart item
  const orderItems:OrderItem[] = cart.items.map(cartItem => {
    const orderItem = new OrderItem();
    orderItem.order = order;
    // orderItem.product = cartItem.product;
    orderItem.quantity = cartItem.quantity;
    
    orderItem.productDetails=cartItem.product;
    return orderItem;
  });
  for (const cartItem of cart.items) {
    cartItem.product.stockQuantity -= cartItem.quantity;
    await this.productRepository.save(cartItem.product);
  }

  // Save the order and order items to the database
  await this.orderRepository.save(order);
  await this.orderItemRepository.save(orderItems);

  await this.cartItemRepository.softRemove(cart.items);
  
  return "Your order has been successfully placed"
}

  async getPreviousOrders(userId: number): Promise<Order[]> {
    // Query orders associated with the user ID and eagerly load the products
    const orders   = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'], // Ensure products are eagerly loaded
    });
  
    return orders;
  }
  async findOrdersByUserId(userId: number): Promise<Order[]> {
    // Query orders associated with the user ID and eagerly load the products
    const orders   = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'], // Ensure products are eagerly loaded
    });
  
    return orders;
  }

  async findOrdersByOrderId(orderId: number): Promise<Order[]> {
    // Query orders associated with the user ID and eagerly load the products
    const order   = await this.orderRepository.find({
      where: { id:orderId} // Ensure products are eagerly loaded
    });
    if(!order){
      throw new NotFoundException("Order id doesnt exist")
    }
  
    return order;
  }

  async sendOrderConfimationMail(userId:number){
    const user=await this.userRepository.findOne({where:{id:userId}});
    await this.mailerService.sendMail({
      to:user.email,
      subject:"Order Confirmation mail",
      html:`Dear ${user.name},<br> Your order has been successfully created`
    });

  }
}