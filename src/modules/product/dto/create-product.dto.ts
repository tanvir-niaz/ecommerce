import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";



export class CreateProductDto {

    @ApiProperty({
        description:"Enter the product name",
        example:"LENOVO LEGION SLIM 7 16IRH8 "
    })
    @IsNotEmpty()
    @IsString()
    name:string;


    @ApiProperty({
        description:"Enter the product description here",
        example:"INTEL CORE I7 13700H 13TH GEN RTX 4060 8GB GRAPHICS 16GB DDR5 RAM 1TB SSD 16 INCH 3.2K 165 HZ IPS DISPLAY STORM GREY GAMING LAPTOP (82Y30072LK)"
    })
    @IsNotEmpty()
    @IsString()
    description:string;



    @ApiProperty({
        description:"Enter the product descroiption here",
        example:250000
    })
    @IsNotEmpty()
    @IsNumber()
    price:number;


    @ApiProperty({
        description:"Enter the discount percentage",
        example:20
    })
    @IsOptional()
    @IsNumber()
    discount:number;

    @ApiProperty({
        description:"Enter the stock quantity here",
        example:25
    })
    @IsNotEmpty()
    @IsNumber()
    stockQuantity:number;

    @IsOptional()
    @IsNumber()
    discountPrice:number;


    @ApiProperty({
        description:"Enter the product categoty here",
        example:"Laptop"
    })
    @IsNotEmpty()
    @IsString()
    category:string;
}
