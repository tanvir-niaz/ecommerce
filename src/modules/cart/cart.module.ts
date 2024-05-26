import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./entities/cart.entity";

import { CartItem } from "./entities/cart-item.entity";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { Promo } from "../promos/entities/promo.entity";

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Cart, Product, CartItem, User, Promo]),
    UserModule,
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartModule],
})
export class CartModule {}
