import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductQueryDto } from './dto/productQuery.dto';
import { error } from 'console';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly productRepository:Repository<Product>){

  }
  async createProduct(createProductDto: CreateProductDto) {
    let product:CreateProductDto=new Product();
    product = this.productRepository.create(createProductDto);
    product.discountPrice=createProductDto.price-Number(createProductDto.price*createProductDto.discount)/100;
    return this.productRepository.save(product);
  }

  async findAllProducts(productQueryDto:ProductQueryDto):Promise<[Product[],number]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

      if (productQueryDto.category) {
        queryBuilder.andWhere('product.category = :category', { category: productQueryDto.category },);
      }
      if (productQueryDto.minPrice) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice: productQueryDto.minPrice });
      }
      if (productQueryDto.maxPrice) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: productQueryDto.maxPrice });
      }
      if (productQueryDto.name) {
        queryBuilder.andWhere('product.name ILIKE :searchName', { searchName: `%${productQueryDto.name}%` });
      }
      if (productQueryDto.description) {
        queryBuilder.andWhere('product.description ILIKE :searchDescription', { searchDescription: `%${productQueryDto.description}%` });
      }

    queryBuilder.offset((productQueryDto.page - 1) * productQueryDto.limit).limit(productQueryDto.limit);

    const [products, total] = await queryBuilder.getManyAndCount();
    return [products, total];

  }

  findOneProduct(id: number) {
    return this.productRepository.find({where:{id}});
  }

  async updateProductById(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.productRepository.findOne({ where: { id } });
  
    if (!product) {
      return {statusCode:HttpStatus.NOT_FOUND,message:"Product not found"};
    }
  
    product = Object.assign(product, updateProductDto);
    this.productRepository.save(product);
    return {
      statusCode:HttpStatus.ACCEPTED,error:null,message:"Product has been successfully updated"
    }
  }

  remove(id: number) {
    this.productRepository.delete(id);
    return {
      statusCode:HttpStatus.OK,error:null,message:"Product successfully deleted"
    }
  }
}
