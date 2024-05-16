import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { Product } from 'src/product/entities/product.entity';
import { JwtAuthGuard } from './guards/cart.guard';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports:[JwtModule,TypeOrmModule.forFeature([Cart,Product,CartItem]),UserModule,ProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartModule]
})
export class CartModule {}
