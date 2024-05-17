import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports:[TypeOrmModule.forFeature([User]),
  MailerModule.forRoot({
    transport:{
      host:'0.0.0.0',
      port:1025,
    },
    defaults:{
      from:"admin@example.com"
      
    }
  })
  ,forwardRef(()=>AuthModule)],
  controllers: [UserController],
  providers: [UserService,JwtService],
  exports:[UserService]
})
export class UserModule {}
