import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsDateString, IsIn, IsInt, IsOptional } from "class-validator";

enum DiscountOn {
  TotalPrice = 'totalPrice',
  DeliveryCharge = 'deliveryCharge',
}

export class CreatePromoDto {
  @ApiProperty({ example: "SUMMER24" })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: "2024-06-30" })
  @IsNotEmpty()
  @IsDateString()
  validTill: string;

  @ApiProperty({ example: 25 })
  @IsNotEmpty()
  discount: number;
  

  @ApiProperty({example:3})
  @IsInt()
  @IsOptional()
  usage_limit:number;
  

  @ApiProperty({example:400})
  @IsInt()
  min_price:number;
  
  @ApiProperty({ enum: DiscountOn, example: DiscountOn.TotalPrice })
  @IsNotEmpty()
  @IsIn([DiscountOn.TotalPrice, DiscountOn.DeliveryCharge])
  discount_on: DiscountOn;

}
