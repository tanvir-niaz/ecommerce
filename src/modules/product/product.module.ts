import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Product]),UserModule],
  controllers: [ProductController],
  providers: [ProductService,JwtService],
})
export class ProductModule {}
