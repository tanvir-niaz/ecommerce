/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PromosService } from './promos.service';
import { PromosController } from './promos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './entities/promo.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { User_promo_usage } from './entities/user_promo_usage';

@Module({
  imports:[TypeOrmModule.forFeature([Promo,User,User_promo_usage]),JwtModule,UserModule],
  controllers: [PromosController],
  providers: [PromosService],
})
export class PromosModule {}

