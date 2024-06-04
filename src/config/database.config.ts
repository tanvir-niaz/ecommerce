import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CartItem } from 'src/modules/cart/entities/cart-item.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { OrderItem } from 'src/modules/order/entities/order-item.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Promo } from 'src/modules/promos/entities/promo.entity';
import { User_promo_usage } from 'src/modules/promos/entities/user_promo_usage';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { User } from 'src/modules/user/entities/user.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,Promo,User_promo_usage,Review], 
  synchronize: configService.get<boolean>('DB_SYNC'),
  // logging: true // Enable logging if needed
});