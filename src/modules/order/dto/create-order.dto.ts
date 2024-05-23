import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { DeliveryType } from "../enum/delivery-type.enum";


export class CreateOrderDto {


    @ApiProperty({
        description:"Enter the shipping address",
        example:"House No.9, Sector 9, Uttara, Dhaka"
    })
    @IsNotEmpty()
    shipping_address:string;
    
    // @IsNotEmpty()
    // @IsEnum(DeliveryType)
    // delivery_type: DeliveryType;


    @ApiProperty({
        description:"Enter the contact number",
        example:"+880187120--1"
    })
    @IsNotEmpty()
    contact_number:string;
    
}
