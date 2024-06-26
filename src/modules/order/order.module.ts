import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";

import { JwtModule } from "@nestjs/jwt";

import { OrderItem } from "./entities/order-item.entity";
import { CartItem } from "../cart/entities/cart-item.entity";
import { CartModule } from "../cart/cart.module";
import { UserModule } from "../user/user.module";
import { User } from "../user/entities/user.entity";
import { Product } from "../product/entities/product.entity";
import { Cart } from "../cart/entities/cart.entity";
import { Promo } from "../promos/entities/promo.entity";
import { User_promo_usage } from "../promos/entities/user_promo_usage";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      Order,
      Product,
      User,
      OrderItem,
      CartItem,
      Promo,
      User_promo_usage
    ]),
    CartModule,
    JwtModule,
    UserModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
