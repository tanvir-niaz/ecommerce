import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { JwtAdminAuthGuard } from './gurads/admin.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post("/signup")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post("/login")
  @UseGuards(AuthGuard("local"))
  login(@Request() req:any) {
    console.log(req.user);
    return this.authService.generateToken(req.user);
  }
  
  @Post("/forgot")
  async forgotPassword(@Body('email') email:string){
    return this.userService.passwordRecovery(email);
  }


  @Post("/reset")
  async resetPassword(@Body()resetPasswordDto:ResetPasswordDto){
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Get()
  @UseGuards(JwtAdminAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  @UseGuards(JwtAdminAuthGuard)
  async findOne(@Param('userId',ParseIntPipe) userId: number) {
    
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  @UseGuards(JwtAdminAuthGuard)
  update(@Param('userId',ParseIntPipe) userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @UseGuards(JwtAdminAuthGuard)
  remove(@Param('userId',ParseIntPipe) userId: number) {
    return this.userService.remove(userId);
  }
}
