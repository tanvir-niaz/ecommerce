import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { Cart } from "../cart/entities/cart.entity";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { CartItem } from "../cart/entities/cart-item.entity";
import { MailerService } from "@nestjs-modules/mailer";
import { Promo } from "../promos/entities/promo.entity";
import { User_promo_usage } from "../promos/entities/user_promo_usage";

@Injectable()
export class OrderService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<Order>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<Cart>,
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
    @InjectRepository(User_promo_usage)
    private readonly user_promo_usage: Repository<User_promo_usage
    >,
  ) {}


  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<object> {
    const cart:Cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product", "user"],
    });
  
    if (!cart || cart.items.length === 0) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: null,
        message: "Cart not found or is empty",
      };
    }
  
    const order = this.createOrderEntity(createOrderDto, cart);
    const orderItems = this.createOrderItems(cart.items, order);
  
    await this.updateProductStock(cart.items);
    await this.updatePromoUsage(cart.promoCodeId);
  
    await this.orderRepository.save(order);
    await this.orderItemRepository.save(orderItems);
  
    await this.clearCart(cart);
  
    this.sendOrderConfimationMail(userId);
  
    return {
      statusCode: HttpStatus.CREATED,
      error: null,
      message: "Your order has been successfully placed",
    };
  }
  
  private createOrderEntity(createOrderDto: CreateOrderDto, cart: Cart): Order {
    const order = new Order();
    order.user = cart.user;
    order.contact_number = createOrderDto.contact_number;
    order.cartId = cart.id;
    order.subTotal = cart.subTotal;
    order.totalDiscount = cart.totalDiscount;
    order.totalPriceAfterDiscount = cart.totalPriceAfterDiscount;
    order.priceAfterPromoCode = cart.priceAfterPromoCode;
    order.promoCodeId = cart.promoCodeId ? +cart.promoCodeId : null;
    order.shipping_address = createOrderDto.shipping_address;
    order.totalPrice = cart.totalPrice;
    return order;
  }
  
  private createOrderItems(cartItems: CartItem[], order: Order): OrderItem[] {
    return cartItems.map(cartItem => {
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.quantity = cartItem.quantity;
      orderItem.productDetails = cartItem.product;
      return orderItem;
    });
  }
  
  private async updateProductStock(cartItems: CartItem[]): Promise<void> {
    for (const cartItem of cartItems) {
      cartItem.product.stockQuantity -= cartItem.quantity;
      await this.productRepository.save(cartItem.product);
    }
  }
  
  private async updatePromoUsage(promoCodeId: number): Promise<void> {
    if (promoCodeId) {
      const promoUsage = await this.user_promo_usage.findOne({
        where: { id: promoCodeId },
      });
      if (promoUsage) {
        promoUsage.usage_count += 1;
        await this.user_promo_usage.save(promoUsage);
      }
    }
  }
  
  private async clearCart(cart: Cart): Promise<void> {
    await this.cartItemRepository.softRemove(cart.items);
  
    cart.priceAfterPromoCode = 0;
    cart.delivery_charge = 40;
    cart.promoCodeId = 0;
    cart.totalDiscount = 0;
    cart.promoCode = "";
    cart.subTotal = 0;
    cart.totalPriceAfterDiscount = 0;
    cart.priceAfterPromoCode = 0;
    cart.promoApplied=false;
  
    await this.cartRepository.save(cart);
  }
  
  
  

  async getPreviousOrders(userId: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });

    return orders;
  }
  async findOrdersByUserId(userId: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });

    return orders;
  }

  async findOrdersByOrderId(orderId: number): Promise<Order[]> {
    const order:Order[] = await this.orderRepository.find({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException("Order id doesnt exist");
    }
    return order;
  }

  async removeOrder(orderId: number): Promise<object> {
    const order :Order= await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["items"],
    });
    if (!order) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: NotFoundException,
        message: "OrderId not found",
      };
    }
    await this.orderRepository.delete(orderId);
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: "Successfully removed the order",
    };
  }

  async sendOrderConfimationMail(userId: number): Promise<object> {
    const user :User= await this.userRepository.findOne({ where: { id: userId } });
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Order Confirmation mail",
      html: `Dear ${user.name},<br> Your order has been successfully created`,
    });
    
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: "Confirmation mail has been sent to your email",
    };
  }
}
