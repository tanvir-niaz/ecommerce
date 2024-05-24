import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePromoDto {

    @ApiProperty({example:"EID25"})
    @IsNotEmpty()
    name:string;

    @ApiProperty({example:25})
    @IsNotEmpty()
    discount:number;

}
