import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class AddToCartDto {


  @ApiProperty({
    description:"Give the prouct id",
    example:1
  })
    @IsInt()
    @IsNotEmpty()
    productId: number;


    @ApiProperty({
      description:"Enter the quantity of product here",
      example:10
    })
    @IsInt()
    @IsNotEmpty()
    @Min(1, { message: 'Quantity must be greater than 0' }) 
    quantity: number;
  }