import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UserModule } from 'src/user/user.module';
import { JwtAdminAuthGuard } from 'src/user/gurads/admin.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([Product]),UserModule],
  controllers: [ProductController],
  providers: [ProductService,JwtService],
})
export class ProductModule {}
