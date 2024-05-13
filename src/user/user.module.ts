import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports:[TypeOrmModule.forFeature([User]),forwardRef(()=>AuthModule)],
  controllers: [UserController],
  providers: [UserService,JwtService],
  exports:[UserService]
})
export class UserModule {}
