import { IsIn, IsInt, IsOptional, IsString } from "class-validator";
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

    @ApiProperty({ required: false,type:"number" })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    minPrice: number;

    @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortDirection: 'ASC' | 'DESC';

    @ApiProperty({ required: false , type: "number" })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    discount: number;

    @ApiProperty({ required: false , type: "number" })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
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