import { IsNotEmpty } from "class-validator";


export class CreateOrderDto {

    @IsNotEmpty()
    address:string;
    
}
