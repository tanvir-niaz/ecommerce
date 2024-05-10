import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';


@Module({
  imports: [UserModule,AuthModule,
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
        synchronize: configService.get<boolean>('DB_SYNC'), // Synchronize the schema with the database, only for development
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    CartModule
     // You need to import other modules if you have any
  ],
  controllers: [], // Add your controllers here

  providers: [], // Add your providers here
})
export class AppModule {}

