import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateOrderDto {


@ApiProperty({
    description:"Enter the shipping address",
    example:"House No.9, Sector 9, Uttara, Dhaka"
})
    @IsNotEmpty()
    shipping_address:string;
    
}
