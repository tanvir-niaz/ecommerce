import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class CreateUserDto {
    
    @ApiProperty({
        description:"Enter name here",
        example:"Tanvir Niaz"
    })
    @IsNotEmpty()
    @IsString()
    name:string;

    @ApiProperty({
        description:"Enter email here",
        example:"niaz@gmail.com"
    })
    @IsNotEmpty()
    @IsString()
    email:string;

    @ApiProperty({
        description:"Enter password here",
        example:"password"
    })
    @IsNotEmpty()
    @IsString()
    password:string;

    @ApiProperty({
        description:"Enter the role here",
        example:"user"
    })
    @IsString()
    roles:string;
   
}
