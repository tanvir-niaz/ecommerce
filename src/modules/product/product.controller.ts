import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { JwtAdminAuthGuard } from 'src/guards/admin.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/productQuery.dto';
import { Throttle } from '@nestjs/throttler';
import { title } from 'process';



@ApiTags("products")
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('access-token')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async findAll(@Query()productQueryDto:ProductQueryDto):Promise<{data:Product[],total:number}> {
    const [products,total]= await this.productService.findAllProducts(productQueryDto);
    return {data:products,total};
  }

  @Get("/all-offers")
  async getDiscountProducts(){
    return this.productService.getAllDiscountProduct();
  }

  @Get(':productId')
  findOne(@Param('productId',ParseIntPipe) productId: number) {
    return this.productService.findOneProduct(productId);
  }

  @Patch(':productId')
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAdminAuthGuard)
  update(@Param('productId',ParseIntPipe) productId: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProductById(productId, updateProductDto);
  }

  @Delete(':productId')
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAdminAuthGuard)
  remove(@Param('productId',ParseIntPipe) productId: number) {
    return this.productService.remove(productId);
  }
}
