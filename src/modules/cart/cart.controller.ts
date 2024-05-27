import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/create-cart.dto";
import { JwtAuthGuard } from "../../guards/user.guard";
import { JwtAdminAuthGuard } from "src/guards/admin.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AddPromoDto } from "./dto/add-promo.dto";

@ApiTags("cart")
@ApiBearerAuth("access-token")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() addToCartDto: AddToCartDto, @Req() req: any) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Post("/add-promo")
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard)
  addPromoToCart(@Body() addPromoDto: AddPromoDto, @Req() req: any) {
    return this.cartService.addpromoCart(addPromoDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any): any {
    return this.cartService.findAll(req.user.id);
  }
  @Get("/:userId")
  @UseGuards(JwtAdminAuthGuard)
  findOne(@Param("userId", ParseIntPipe) userId: number, @Req() req: any) {
    return this.cartService.findCartByUserId(userId);
  }
  @Delete(":cartId")
  @UseGuards(JwtAuthGuard)
  remove(@Param("cartId", ParseIntPipe) cartId: number) {
    return this.cartService.deleteProductByCartId(cartId);
  }
}
