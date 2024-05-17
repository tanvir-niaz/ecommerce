import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly productRepository:Repository<Product>){

  }
  async createProduct(createProductDto: CreateProductDto) {
    let product:CreateProductDto=new Product();
    product = this.productRepository.create(createProductDto);;
    return this.productRepository.save(product);
  }

  async findAllProducts(page:number,limit:number,filters:any):Promise<[Product[],number]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (filters) {
      if (filters.category) {
        queryBuilder.andWhere('product.category = :category', { category: filters.category },);
      }
      if (filters.minPrice) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
      }
      if (filters.maxPrice) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }
      if (filters.searchName) {
        queryBuilder.andWhere('product.name ILIKE :searchName', { searchName: `%${filters.searchName}%` });
      }
      if (filters.searchDescription) {
        queryBuilder.andWhere('product.description ILIKE :searchDescription', { searchDescription: `%${filters.searchDescription}%` });
      }
    }

    queryBuilder.offset((page - 1) * limit).limit(limit);

    const [products, total] = await queryBuilder.getManyAndCount();
    return [products, total];

  }

  findOneProduct(id: number) {
    return this.productRepository.find({where:{id}});
  }

  async updateProductById(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.productRepository.findOne({ where: { id } });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    // Update product properties
    product = Object.assign(product, updateProductDto);
  
    return this.productRepository.save(product);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
