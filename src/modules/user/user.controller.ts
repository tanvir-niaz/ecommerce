import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { JwtAdminAuthGuard } from './gurads/admin.guard';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

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
