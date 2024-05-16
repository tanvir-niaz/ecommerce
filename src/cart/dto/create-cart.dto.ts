import { IsInt, IsNotEmpty } from "class-validator";

export class AddToCartDto {
    @IsInt()
    @IsNotEmpty()
    productId: number;
  
    @IsInt()
    @IsNotEmpty()
    quantity: number;
  }