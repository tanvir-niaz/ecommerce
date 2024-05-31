import { PartialType } from '@nestjs/mapped-types';
import { AddToCartDto } from './create-cart.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateCartDto {
    @ApiProperty({ example: 1, description: "Enter the cartItemId" })
    @IsInt()
    cartItemId: number;

    @ApiProperty({example:5})
    @IsInt()
    quantity:number;

}
