import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";



export class AddPromoDto{
    @ApiProperty({ example: "EID25", description: "The promo code to be applied" })
    @IsOptional()
    name: string;
}
