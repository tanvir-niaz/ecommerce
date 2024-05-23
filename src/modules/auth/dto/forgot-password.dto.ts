import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class ForgotPasswordDto {
    

    @ApiProperty({
        description:"Enter email here",
        example:"niaz@gmail.com"
    })
    @IsNotEmpty()
    @IsString()
    email:string;
}
