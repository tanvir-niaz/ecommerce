import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, UseGuards, ParseIntPipe } from '@nestjs/common';
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
    return this.cartService.createCart(createCartDto,req.user.id);
  }
 
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req:any):any {
    return this.cartService.findAll(req.user.id);
  }
  @Get('/all')
  @UseGuards(JwtAdminAuthGuard)
  findAllCart(@Req() req:any):any {
    return this.cartService.findAllCart();
  }

  @Get('/:id')
  @UseGuards(JwtAdminAuthGuard)
  findOne(@Param('id',ParseIntPipe) id: number,@Req()req:any) {
    return this.cartService.findOne(id);
  }

  @Patch(':orderId')
  @UseGuards(JwtAuthGuard)
  update(@Param('orderId',ParseIntPipe) id: number, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateOrder(id, updateCartDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }
}
