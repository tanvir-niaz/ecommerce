import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { JwtAdminAuthGuard } from 'src/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("products")
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async findAll(@Query('page')page=1,@Query('limit')limit=10,@Query()filters:any):Promise<{data:Product[],total:number}> {
    const [products,total]= await this.productService.findAllProducts(page,limit,filters);
    return {data:products,total};
  }
  //get by product id
  @Get(':productId')
  findOne(@Param('productId',ParseIntPipe) productId: number) {
    return this.productService.findOneProduct(productId);
  }

  @Patch(':productId')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  update(@Param('productId',ParseIntPipe) productId: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProductById(productId, updateProductDto);
  }

  @Delete(':productId')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  remove(@Param('productId',ParseIntPipe) productId: number) {
    return this.productService.remove(productId);
  }
}
