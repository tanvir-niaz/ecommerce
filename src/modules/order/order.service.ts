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
  ) {}
  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<object> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product", "user"],
    });

    if (!cart) {
      throw new NotFoundException("Cart not found for the user");
    }
    if (cart.items.length == 0) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: null,
        message: "Cart not found",
      };
    }

    const order = new Order();
    order.user = cart.user;
    order.contact_number = createOrderDto.contact_number;
    order.cartId = cart.id;
    order.totalPrice = cart.totalPrice;
    order.totalDiscount = cart.totalDiscount;
    order.totalPriceAfterDiscount = cart.totalPriceAfterDiscount;
    order.priceAfterPromoCode = cart.priceAfterPromoCode;
    // order.promoCode = cart.promoCode;
    // order.promoCodeId = cart.promoCodeId;
    order.shipping_address = createOrderDto.shipping_address;
    
    const promo = await this.promoRepository.findOne({
      where: { id: cart.promoCodeId },
    });

    // if (promo) {
    //   (await promo).isAvailed = true;
    //   await this.promoRepository.save(promo);
    // }
    const orderItems: OrderItem[] = cart.items.map((cartItem) => {
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.quantity = cartItem.quantity;

      orderItem.productDetails = cartItem.product;
      return orderItem;
    });
    for (const cartItem of cart.items) {
      cartItem.product.stockQuantity -= cartItem.quantity;
      await this.productRepository.save(cartItem.product);
    }
    cart.priceAfterPromoCode = 0;
    await this.cartRepository.save(cart);
    await this.orderRepository.save(order);
    await this.orderItemRepository.save(orderItems);
    await this.cartItemRepository.softRemove(cart.items);
    this.sendOrderConfimationMail(userId);

    return {
      statusCode: HttpStatus.CREATED,
      error: null,
      message: "Your order has been successfully placed",
    };
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
    const order = await this.orderRepository.find({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException("Order id doesnt exist");
    }

    return order;
  }

  async removeOrder(orderId: number): Promise<object> {
    const order = await this.orderRepository.findOne({
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

    const orderItemIds = order.items.map((item) => item.id);
    if (orderItemIds.length > 0) {
      await this.orderItemRepository.delete(orderItemIds);
    }
    await this.orderRepository.delete(orderId);
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: "Successfully removed the order",
    };
  }

  async sendOrderConfimationMail(userId: number): Promise<object> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
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
