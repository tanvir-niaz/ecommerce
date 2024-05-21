import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from 'src/config/mail.config';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports:[TypeOrmModule.forFeature([User]),
  MailerModule.forRoot(
    mailConfig
  )
  ,forwardRef(()=>AuthModule)],
  controllers: [UserController],
  providers: [UserService,JwtService],
  exports:[UserService]
})
export class UserModule {}
