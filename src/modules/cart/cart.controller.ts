import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from './guards/cart.guard';
import { JwtAdminAuthGuard } from '../user/gurads/admin.guard';


@Controller('cart')

export class CartController {
  constructor(private readonly cartService: CartService,
   
  ) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() addToCartDto: AddToCartDto, @Req() req:any) {
    // console.log("from contoller cart " ,req.user.id);
    return this.cartService.addToCart(req.user.id,addToCartDto,);

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
    return this.cartService.deleteProductByCartId(CartId);
  }
}
