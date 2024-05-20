import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/guards/user.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from 'src/guards/admin.guard';

@ApiTags("order")
@ApiBearerAuth('access-token') 
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto:CreateOrderDto,@Req() req:any) {
    this.orderService.createOrder(createOrderDto,req.user.id);
    this.orderService.sendOrderConfimationMail(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req:any) {
    return this.orderService.getPreviousOrders(req.user.id);
  }

  @Get(':userId')
  @UseGuards(JwtAdminAuthGuard)
  findOne(@Param('userId',ParseIntPipe) userId: number) {
    return this.orderService.findOrdersByUserId(userId);
  }
  @Get(':orderId')
  @UseGuards(JwtAdminAuthGuard)
  findOrdersByOrderId(@Param('orderId',ParseIntPipe) orderId: number) {
    return this.orderService.findOrdersByUserId(orderId);
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    // return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    // return this.orderService.remove(id);
  }
}
