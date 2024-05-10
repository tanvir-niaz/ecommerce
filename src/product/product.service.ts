import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly productRepositoty:Repository<Product>){

  }
  async create(createProductDto: CreateProductDto) {
    let product:CreateProductDto=new Product();
    product = this.productRepositoty.create(createProductDto);;
    return this.productRepositoty.save(product);
  }

  findAll() {
    return this.productRepositoty.find();
  }

  findOne(id: number) {
    return this.productRepositoty.find({where:{id}});
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.productRepositoty.findOne({ where: { id } });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    // Update product properties
    product = Object.assign(product, updateProductDto);
  
    return this.productRepositoty.save(product);
  }

  remove(id: number) {
    return this.productRepositoty.delete(id);
  }
}
