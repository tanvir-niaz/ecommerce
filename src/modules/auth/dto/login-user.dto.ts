import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class LoginUserDto {
    

    @ApiProperty({
        description:"Enter email here",
        example:"niaz@gmail.com"
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string;

    
    @ApiProperty({
        description:"Enter password here",
        example:"password"
    })
    @IsNotEmpty()
    @IsString()
    password:string;

   
}
