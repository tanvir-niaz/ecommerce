import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AddToCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "./entities/cart.entity";
import { Repository } from "typeorm";
import { CartItem } from "./entities/cart-item.entity";
import { User } from "../user/entities/user.entity";
import { Product } from "../product/entities/product.entity";
import { AddPromoDto } from "./dto/add-promo.dto";
import { Promo } from "../promos/entities/promo.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>
  ) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<object> {
    const { productId, quantity } = addToCartDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user", "items", "items.product"],
    });
    if (!cart) {
      cart = new Cart();
      cart.user = user;
      await this.cartRepository.save(cart);
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: product.id } },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new CartItem();
      cartItem.cart = cart;
      cartItem.product = product;
      cartItem.quantity = quantity;
    }
    if (cartItem.quantity > product.stockQuantity) {
      throw new BadRequestException("Not enough stock");
      return;
    }
    user.cart = cart;
    await this.userRepository.save(user);
    await this.cartItemRepository.save(cartItem);
    return {
      statusCode: HttpStatus.CREATED,
      error: null,
      message: "Successfully added to the cart",
    };
  }

  async findAll(userId: number): Promise<{
    cartItems: CartItem[];
    subTotal: number;
    totalDiscount: number;
    totalPriceAfterDiscount: number;
    priceAfterCoupon: number;
    deliveryCharge:number;
    totalPrice:number
  }|any> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });
    if(cart.items.length==0){
      return{
        statusCode:HttpStatus.OK,
        error:null,
        message:"No items in the cart"
      }
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["user_promo_usage","user_promo_usage.promo"],
    });
    // console.log(cart.priceAfterPromoCode)
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
    
    let subTotal: number = 0;
    let totalPriceAfterDiscount: number = 0;
    for (const cartItem of cart.items) {
      subTotal += cartItem.product.price * cartItem.quantity;
      totalPriceAfterDiscount +=
        cartItem.product.discountPrice * cartItem.quantity;
    }
    cart.subTotal = subTotal;
    cart.totalDiscount = subTotal - totalPriceAfterDiscount;
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    if(cart.items.length==0){
      cart.priceAfterPromoCode=0;
    }
    if(cart.priceAfterPromoCode==0){
      cart.priceAfterPromoCode=cart.totalPriceAfterDiscount;
    }
    const promo = user.user_promo_usage.find((promo) => promo.id === cart.promoCodeId);
    if(cart.promoApplied){
      if(promo?.promo.min_price>cart.subTotal){
        cart.priceAfterPromoCode=cart.totalPriceAfterDiscount;
        cart.delivery_charge=40;
      }
      else if(promo?.promo.discount_on=="deliveryCharge"){
        cart.delivery_charge=0;
        cart.priceAfterPromoCode=cart.totalPriceAfterDiscount;
      }
      else{
        cart.delivery_charge=40;
        cart.priceAfterPromoCode =Math.round(
          cart.subTotal - (cart.subTotal * promo?.promo.discount) / 100);
      }
    }
    else{
      cart.priceAfterPromoCode=cart.totalPriceAfterDiscount;
    }
    
    // await this.cartRepository.save(cart);
    cart.totalPrice=Math.min(cart.priceAfterPromoCode,cart.totalPriceAfterDiscount)+cart.delivery_charge;
    await this.cartRepository.save(cart);
    
    return {
      cartItems: cart.items,
      subTotal: cart.subTotal,
      totalDiscount: cart.totalDiscount,
      deliveryCharge:cart.delivery_charge,
      totalPriceAfterDiscount: cart.totalPriceAfterDiscount,
      priceAfterCoupon: cart.priceAfterPromoCode,
      totalPrice:cart.totalPrice
    };
  }

  async findAllCart() {
    return this.cartRepository.find();
  }


  async addpromoCart(addPromoDto: AddPromoDto, userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["user_promo_usage","user_promo_usage.promo"],
    });
    console.log(user.user_promo_usage);
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });
    if(cart.items.length==0){
      return{
        statusCode:HttpStatus.BAD_REQUEST,
        error:null,
        message:"Add some products to the cart"
      }
    }
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    if(addPromoDto.id==""){
      cart.priceAfterPromoCode=cart.totalPriceAfterDiscount;
      cart.delivery_charge=40;
      cart.promoApplied=false;
      this.cartRepository.save(cart);
      return{
        statusCode:HttpStatus.OK,
        error:null,
        message:"Promo code didnt applied"
      }
    }
    const promo = user.user_promo_usage.find((promo) => promo.id === +addPromoDto.id);
    console.log("promo",promo);

    if (!promo ) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: null,
        message: "Promo name not found",
      };
    }
    if(promo?.promo.min_price>cart.subTotal){
      return{
        statusCode:HttpStatus.BAD_REQUEST,
        error:null,
        message:`For applying promo code minimum price should be ${promo.promo.min_price}`
      }
    }
    if(promo.promo.validTill<new Date()){
      return{
        statusCode:HttpStatus.BAD_REQUEST,
        error:null,
        message:"Promo is not valid"
      }
    }

    if (promo.usage_count>=promo.promo.usage_limit) {
      // cart.delivery_charge=40;
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: "Promo already used maximum times" ,
        message: `Promo with name ${addPromoDto.id} has already used maximum times by the user`,
      };
    }
    cart.promoCodeId = +addPromoDto.id;
    cart.promoApplied=true;
    await this.cartRepository.save(cart);
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: `Promo ${addPromoDto.id} applied successfully`,
    };
  }

  async findCartByUserId(user_id: number): Promise<CartItem | object> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user_id } },
      relations: ["items", "items.product"],
    });
    if (!cart) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: null,
        message: "No cart found",
      };
    }
    return cart.items;
  }

  async updateCart(
    updateCartDto: UpdateCartDto, user_id: number
  ): Promise<object> {
    const { cartItemId, quantity } = updateCartDto;
  
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user_id } },
      relations: ["items", "items.product"]
    });
    
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
  
    const cartItem = cart.items.find(item => item.id === cartItemId);
    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    if(updateCartDto.quantity<0){
      return{
        statusCode:HttpStatus.BAD_REQUEST,
        error:null,
        message:"Quantity must be positive"
      }
    }
  
    if (quantity <= 0) {
      await this.cartItemRepository.remove(cartItem);
    } else {
      const product = await this.productRepository.findOne({
        where: { id: cartItem.product.id }
      });
      if (product && quantity > product.stockQuantity) {
        throw new BadRequestException("Not enough stock");
      }
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);
    }
  
    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: "Cart updated successfully",
    };
  }
  

  async deleteProductByCartId(cartId: number) {
    return this.cartItemRepository.delete(cartId);
    
  }
}
