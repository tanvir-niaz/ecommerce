import { IsInt, IsOptional, IsString } from "class-validator";
import { CreateProductDto } from "./create-product.dto";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ProductQueryDto {


    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    category: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    minPrice: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()

    maxPrice: number;


    @ApiProperty({ default: 1, required: false, type: "number" })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page: number;


    @ApiProperty({ default: 10, required: false, type: "number" })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit: number;

}