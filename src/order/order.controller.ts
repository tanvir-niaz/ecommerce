import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/cart/guards/cart.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto,@Req() req:any) {
    return this.orderService.create(createOrderDto,req.user.id);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
