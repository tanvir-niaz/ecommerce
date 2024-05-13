import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/cart.guard';
import { JwtAdminAuthGuard } from 'src/user/gurads/admin.guard';

@Controller('cart')

export class CartController {
  constructor(private readonly cartService: CartService,
   
  ) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCartDto: CreateCartDto, @Req() req:any) {
    console.log(req.user);
    return this.cartService.create(createCartDto,req.user.id);
  }
 
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req:any):any {
    return this.cartService.findAll(req.user.id);
  }

  @Get('/all')
  @UseGuards(JwtAdminAuthGuard)
  findOne(@Param('id') id: string,@Req()req:any) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
