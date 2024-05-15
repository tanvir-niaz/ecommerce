import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { STATUS_CODES } from 'http';
import { error } from 'console';

@Injectable()
export class CartService {

  constructor(@InjectRepository(Cart) private readonly cartRepository:Repository<Cart>,@InjectRepository(Product) private readonly productRepository: Repository<Product> ){}



  async createCart(createCartDto: CreateCartDto,user_id:number) {
    const product =await this.productRepository.findOne({ where: { id: createCartDto.product_id } });
    // console.log(product);
    if (!product) {
      
      throw new HttpException(`Product with ID ${createCartDto.product_id} not found`, HttpStatus.INTERNAL_SERVER_ERROR);

    }
    const existingCartItems = await this.cartRepository.find({ where: { product_id: createCartDto.product_id } });

    let cart: Cart;

    if (existingCartItems && existingCartItems.length > 0) {
        const totalQuantity = existingCartItems.reduce((total, item) => total + item.product_quantity, 0);
        const newQuantity  = totalQuantity + createCartDto.product_quantity;

        existingCartItems[0].product_quantity = newQuantity;
        
        if(newQuantity>product.stockQuantity){
          throw new BadRequestException('Not enough stock');
        }
        cart = await this.cartRepository.save(existingCartItems[0]);
    } else {
        
        cart = new Cart();
        cart.user_id = user_id;
        cart.product_id = createCartDto.product_id;
        cart.product_quantity = createCartDto.product_quantity;
        const product =await this.productRepository.findOne({ where: { id: createCartDto.product_id } });
        if(product.stockQuantity<cart.product_quantity){
          return new BadRequestException("Not enough Stock")
        }
        cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async findAll(user_id: number) {
    const allCartItems: any = await this.cartRepository.find({ where: { user_id } });
    let totalPrice = 0;

    for (const cartItem of allCartItems) {
      const product = await this.productRepository.findOne({ where: { id: cartItem.product_id } });
      if (product) {
        totalPrice += product.price * cartItem.product_quantity;
      }
      cartItem.product_name = product.name;
      cartItem.product_description = product.description;
      cartItem.product_price = product.price;
    }
    return { cartItems: allCartItems, totalPrice };
  }

  async findAllCart(){
    return this.cartRepository.find();
  }

  findOne(user_id: number) {
    return this.cartRepository.find({where:{user_id}});
  }

  async updateOrder(id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({where:{id}});
    const product=await this.productRepository.findOne({where:{id:cart.product_id}});
    if(product.stockQuantity<updateCartDto.product_quantity){
      throw new BadRequestException("Not enough stock");
    }
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    // console.log(cart);
    cart.product_quantity = updateCartDto.product_quantity; 
    return this.cartRepository.save(cart);
  }

  remove(id: number) {
    return this.cartRepository.delete(id);
  }
}
