import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

import { CartItem } from './entities/cart-item.entity';


import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CartService {

  constructor(@InjectRepository(User) private readonly userRepository:Repository<User>,@InjectRepository(Cart) private readonly cartRepository:Repository<Cart>,@InjectRepository(CartItem) private readonly cartItemRepository:Repository<CartItem>,@InjectRepository(Product) private readonly productRepository: Repository<Product> ){}

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<string> {
    const { productId, quantity } = addToCartDto;
    
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let cart = await this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['user', 'items', 'items.product'] });
    if (!cart) {
      cart = new Cart();
      cart.user = user;
      // console.log("New cart created for user:", cart.user);
      await this.cartRepository.save(cart);
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: product.id } }
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new CartItem();
      cartItem.cart = cart;
      cartItem.product = product;
      cartItem.quantity = quantity;
    }
    if(cartItem.quantity>product.stockQuantity){
      throw new  BadRequestException("Not enough stock");
      return;
    }
    user.cart=cart;
    // console.log(cart);
    await this.userRepository.save(user);
    // console.log(user)
    await this.cartItemRepository.save(cartItem);
    return "Successfully added to the cart"
  }


  async findAll(userId: number): Promise<{ cartItems: CartItem[], totalPrice: number }> {
    const cart = await this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['items', 'items.product'] });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    let totalPrice = 0;
    for (const cartItem of cart.items) {
      totalPrice += cartItem.product.price * cartItem.quantity;
    }

    return { cartItems: cart.items, totalPrice };
  }



  async findAllCart(){
    return this.cartRepository.find();
  }

  async findCartByUserId(user_id: number) {
    const cart = await this.cartRepository.findOne({ where: { user: { id: user_id } }, relations: ['items', 'items.product'] });
    if(!cart){
      throw new NotFoundException("No cart found");
    }
    return cart.items;

  }

  async updateCart(cartItemId: number, updateCartDto: UpdateCartDto): Promise<CartItem> {
    const { quantity } = updateCartDto;
    const cartItem = await this.cartItemRepository.findOne({where:{id:cartItemId}});

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    cartItem.quantity = quantity;
    return await this.cartItemRepository.save(cartItem);
  }

  async deleteProductByCartId(cartId:number){
    return this.cartItemRepository.delete(cartId);

  }

  
}
