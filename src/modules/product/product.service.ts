import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { ProductQueryDto } from "./dto/productQuery.dto";
import { error } from "console";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);

    const discount: number = createProductDto.discount ?? 0;
    const price: number = createProductDto.price ?? 0;
    if (discount == 0) {
      product.discountPrice = product.price;
    } else {
      product.discountPrice = price - (price * discount) / 100;
    }
    return this.productRepository.save(product);
  }

  async findAllProducts(
    productQueryDto: ProductQueryDto
  ): Promise<[Product[], number]> {
    const queryBuilder = this.productRepository.createQueryBuilder("product");

    if (productQueryDto.category) {
      queryBuilder.andWhere("product.category ILIKE  :category", {
        category: `%${productQueryDto.category}%`,
      });
    }
    if (productQueryDto.discount) {
      queryBuilder.andWhere("product.discount = :discount", {
        discount: productQueryDto.discount,
      });
    }
    if (productQueryDto.minPrice) {
      queryBuilder.andWhere("product.price >= :minPrice", {
        minPrice: productQueryDto.minPrice,
      });
    }
    if (productQueryDto.maxPrice) {
      queryBuilder.andWhere("product.price <= :maxPrice", {
        maxPrice: productQueryDto.maxPrice,
      });
    }
    if (productQueryDto.name) {
      queryBuilder.andWhere("product.name ILIKE :searchName", {
        searchName: `%${productQueryDto.name}%`,
      });
    }
    if (productQueryDto.description) {
      queryBuilder.andWhere("product.description ILIKE :searchDescription", {
        searchDescription: `%${productQueryDto.description}%`,
      });
    }
    queryBuilder.orderBy("product.price", productQueryDto.sortDirection);
    queryBuilder
      .offset((productQueryDto.page - 1) * productQueryDto.limit)
      .limit(productQueryDto.limit);

    const [products, total] = await queryBuilder.getManyAndCount();
    return [products, total];
  }

  async findOneProduct(id: number) {
    const product=await  this.productRepository.find({ where: { id } });
    if(!product || product.length==0){
      return {
        statusCode:HttpStatus.NOT_FOUND,
        error:null,
        message:`No product with Id ${id}`
      }
    }
    return product;
  }

  async getAllDiscountProduct(): Promise<Product[] | object> {
    const products: Product[] = await this.productRepository.find({
      where: {
        discount: MoreThan(0),
      },
    });
    if (!products) {
      return {
        statusCode: HttpStatus.OK,
        error: null,
        message: "No products found",
      };
    }
    return products;
  }

  async updateProductById(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<object> {
    let product: Product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      return { statusCode: HttpStatus.NOT_FOUND, message: "Product not found" };
    }
    const discount: number = updateProductDto.discount ?? product.discount;
    const price: number = updateProductDto.price ?? product.price;
    if (discount > 0 && price) {
      product.discountPrice = price - (price * discount) / 100;
    } else if (discount > 0) {
      product.discountPrice = product.price - (product.price * discount) / 100;
    }

    product = Object.assign(product, updateProductDto);
    await this.productRepository.save(product);

    return {
      statusCode: HttpStatus.OK,
      error: null,
      data: product,
      message: "Product has been successfully updated",
    };
  }

  async remove(id: number): Promise<object> {
    const product = await this.productRepository.delete(id);
    if (!product) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: null,
        message: "Product not found",
      };
    }
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: "Product successfully deleted",
    };
  }
}
