import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from 'src/cart/guards/cart.guard';
import { CartModule } from 'src/cart/cart.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cart,Order,Product,User,OrderItem,CartItem]),CartModule,JwtModule,UserModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
