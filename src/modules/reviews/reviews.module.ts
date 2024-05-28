import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/user.guard';
import { UserModule } from '../user/user.module';
import { Review } from './entities/review.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Product,Review]),JwtModule,UserModule],
  controllers: [ReviewsController],
  providers: [ReviewsService,JwtAuthGuard],
})
export class ReviewsModule {}
