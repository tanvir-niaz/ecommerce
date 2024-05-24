import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddPromoDto {


    @ApiProperty({example:"Eid25"})
    @IsNotEmpty()
    name:string;
    
}
