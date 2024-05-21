import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req, Res } from '@nestjs/common';

import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.sto';
import { UserService } from 'src/modules/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Request, Response } from 'express';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post("/signup")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post("/login")
  @UseGuards(AuthGuard("local"))
  login(@Body() loginUserDto:LoginUserDto,@Req() req:any) {
    // console.log(req.user);
    return this.authService.generateToken(req.user);
  } 

  @Post("/forgot-password")
  async forgotPassword(@Body() forgotPasswordDto:ForgotPasswordDto){
    return this.authService.passwordRecovery(forgotPasswordDto);
  }

  @Post("/reset-password")
  async resetPassword(@Body()resetPasswordDto:ResetPasswordDto, @Req() req: Request, @Res({passthrough:true}) res: Response){
    console.log("From reset password ",res.header);
    return this.authService.resetPassword(resetPasswordDto);
  }
}
