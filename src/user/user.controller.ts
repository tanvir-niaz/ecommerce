import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
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
    return this.userService.create(createUserDto);
  }

  @Post("/login")
  @UseGuards(AuthGuard("local"))
  login(@Request() req) {
    console.log(req.user);
    return this.authService.generateToken(req.user);
  }
  @Post("/forgot")
  async forgotPassword(@Body('email')email:string){
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

  @Get(':id')
  @UseGuards(JwtAdminAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
