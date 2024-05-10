import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import {UserModule} from "../user/user.module"
import { LocalStrategy } from './local.strategy';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService,ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports:[forwardRef(()=>UserModule),PassportModule,TypeOrmModule.forFeature([User]),
  TypeOrmModule.forFeature([User]),
    ConfigModule, // Import ConfigModule to access ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here as well
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('secret_key'),
        signOptions: { expiresIn: '1h' }
      }),
      inject: [ConfigService],})
],
  controllers: [],
  providers: [LocalStrategy,AuthService,JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}
