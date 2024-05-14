import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { JwtAdminAuthGuard } from 'src/user/gurads/admin.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(@Query('page')page=1,@Query('limit')limit=10,@Query()filters:any):Promise<{data:Product[],total:number}> {
    const [products,total]= await this.productService.findAll(page,limit,filters);
    return {data:products,total};
  }
  //get by product id
  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
  update(@Param('id',ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
