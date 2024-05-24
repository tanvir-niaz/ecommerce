import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class ForgotPasswordDto {
    

    @ApiProperty({
        description:"Enter email here",
        example:"niaz@gmail.com"
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string;
}
