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
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

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
      // console.log("New cart created for user:", cart.user);
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
    totalPrice: number;
    totalDiscount: number;
    totalPriceAfterDiscount: number;
    priceAfterCoupon: number;
  }> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
    let totalPrice: number = 0;
    let totalPriceAfterDiscount: number = 0;
    for (const cartItem of cart.items) {
      totalPrice += cartItem.product.price * cartItem.quantity;
      totalPriceAfterDiscount +=
        cartItem.product.discountPrice * cartItem.quantity;
    }
    cart.totalPrice = totalPrice;
    cart.totalDiscount = totalPrice - totalPriceAfterDiscount;
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    this.cartRepository.save(cart);
    return {
      cartItems: cart.items,
      totalPrice: cart.totalPrice,
      totalDiscount: cart.totalDiscount,
      totalPriceAfterDiscount: cart.totalPriceAfterDiscount,
      priceAfterCoupon: cart.priceAfterPromoCode,
    };
  }

  async findAllCart() {
    return this.cartRepository.find();
  }
  async addpromoCart(addPromoDto: AddPromoDto, userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["promos"],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const promo = user.promos.find((promo) => promo.name === addPromoDto.name);
    console.log(promo);

    if (!promo) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: null,
        message: "Promo name not found",
      };
    }

    if (promo.isAvailed) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: "Promo already used",
        message: `Promo with name ${addPromoDto.name} has already been used by the user`,
      };
    }

    promo.isAvailed = true;
    await this.promoRepository.save(promo);
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });
    cart.promoCode = addPromoDto.name;
    cart.promoCodeId = promo.id;
    cart.priceAfterPromoCode =
      cart.totalPrice - (cart.totalPrice * promo.discount) / 100;
    if (!cart) {
      throw new NotFoundException(`Cart not found for user with id ${userId}`);
    }
    await this.cartRepository.save(cart);

    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: `Promo ${addPromoDto.name} applied successfully`,
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
    cartItemId: number,
    updateCartDto: UpdateCartDto
  ): Promise<CartItem> {
    const { quantity } = updateCartDto;
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    cartItem.quantity = quantity;
    return await this.cartItemRepository.save(cartItem);
  }

  async deleteProductByCartId(cartId: number) {
    return this.cartItemRepository.delete(cartId);
  }
}
