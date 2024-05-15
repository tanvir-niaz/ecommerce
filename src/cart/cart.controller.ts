import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
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

  @Get('/:userId')
  @UseGuards(JwtAdminAuthGuard)
  findOne(@Param('userId',ParseIntPipe) userId: number,@Req()req:any) {
    return this.cartService.findCartByUserId(userId);
  }

  @Patch(':cartId')
  @UseGuards(JwtAuthGuard)
  update(@Param('cartId',ParseIntPipe) cartId: number, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(cartId, updateCartDto);
  }

  @Delete(':CartId')
  @UseGuards(JwtAuthGuard)
  remove(@Param('CartId',ParseIntPipe) CartId: number) {
    return this.cartService.removeCartById(CartId);
  }
}
