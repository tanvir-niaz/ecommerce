import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/guards/user.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from 'src/guards/admin.guard';
import { error } from 'console';

@ApiTags("orders")
@ApiBearerAuth('access-token') 
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  create(@Body() createOrderDto:CreateOrderDto,@Req() req:any) {
    return this.orderService.createOrder(createOrderDto,req.user.id);
    
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  findAll(@Req() req:any) {
    return this.orderService.getPreviousOrders(req.user.id);
  }

  @Get('/user/:userId')
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAdminAuthGuard)
  findOne(@Param('userId',ParseIntPipe) userId: number) {
    return this.orderService.findOrdersByUserId(userId);
  }


  @Get(':orderId')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth("access-token")
  findOrdersByOrderId(@Param('orderId',ParseIntPipe) orderId: number) {
    return this.orderService.findOrdersByOrderId(orderId);
  }

  @Delete(':orderId')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth("access-token")
  remove(@Param('orderId',ParseIntPipe) orderId: number) {
    try{
    return this.orderService.removeOrder(orderId);

    }
    catch{
      throw new error;
    }
  }
}
