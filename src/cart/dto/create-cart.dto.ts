import { IsNotEmpty } from "class-validator";

export class CreateCartDto {
    
    @IsNotEmpty()
    product_id:number;

    @IsNotEmpty()
    quantity:number;

    @IsNotEmpty()
    user_id:number;

}
