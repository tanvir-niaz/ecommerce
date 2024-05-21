import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService,ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { User } from 'src/modules/user/entities/user.entity';
import { UserModule } from 'src/modules/user/user.module';


@Module({
  imports:[forwardRef(()=>UserModule),PassportModule,TypeOrmModule.forFeature([User]),
  TypeOrmModule.forFeature([User]),
    ConfigModule, // Import ConfigModule to access ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here as well
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('secret_key'),
        signOptions: { expiresIn: '4h' }
      }),
      inject: [ConfigService],})
],
  controllers: [AuthController],
  providers: [LocalStrategy,AuthService,JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}
