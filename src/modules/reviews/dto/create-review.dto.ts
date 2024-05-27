import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateReviewDto {

    @ApiProperty({example:"This is a good product"})
    @IsString()
    @IsNotEmpty()
    @Length(1, 500)
    review:string;

    @ApiProperty({example:4})
    @IsNumber()
    @IsNotEmpty()
    ratings:number;

    @ApiProperty({example:4})
    @IsNotEmpty()
    @IsNotEmpty()
    product_id:number;
}
