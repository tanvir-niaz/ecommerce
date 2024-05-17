import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [UserModule,AuthModule,JwtModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ".local.env"
      })],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname+'/**/*.entity{.ts,.js}'], // Add your entities here
        synchronize: configService.get<boolean>('DB_SYNC'),
        // logging:true// Synchronize the schema with the database, only for development
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    CartModule,
    OrderModule
  ],
  controllers: [],

  providers: [], 
})
export class AppModule {}

