import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.sto';


@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post("/signup")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post("/login")
  @UseGuards(AuthGuard("local"))
  login(@Request() req:any) {
    console.log(req.user);
    return this.authService.generateToken(req.user);
  } 

  @Post("/forgot")
  async forgotPassword(@Body('email') email:string){
    return this.authService.passwordRecovery(email);
  }

  @Post("/reset")
  async resetPassword(@Body()resetPasswordDto:ResetPasswordDto){
    return this.authService.resetPassword(resetPasswordDto);
  }
}
