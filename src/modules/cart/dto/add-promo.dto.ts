import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";



export class AddPromoDto{
    @ApiProperty({ example: "33", description: "The promo code to be applied" })
    @IsOptional()
    id: string;
}
