import { IsNotEmpty } from "class-validator";

export class CreateCartDto {
    
    @IsNotEmpty()
    product_id:number;

    @IsNotEmpty()
    product_quantity:number;

}
