import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

import { JwtAdminAuthGuard } from 'src/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { userInterceptor } from './interceptors/user.interceptor';

@ApiTags("users")
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(userInterceptor)
  @ApiBearerAuth("access-token")
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(userInterceptor)
  @ApiBearerAuth('access-token')
  async findOne(@Param('userId',ParseIntPipe) userId: number) {
    
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('access-token')
  update(@Param('userId',ParseIntPipe) userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('access-token')
  remove(@Param('userId',ParseIntPipe) userId: number) {
    return this.userService.remove(userId);
  }
}
