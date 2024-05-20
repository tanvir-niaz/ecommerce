import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class ResetPasswordDto {

    @ApiProperty({
        description:"Enter the token here",
        example:"kasfdjk432184fndsa"
    })
    @IsNotEmpty()
    @IsString()
    token:string;


    @ApiProperty({
        description:"Enter the new password",
        example:"newpassword"
    })
    @IsNotEmpty()
    @IsString()
    password:string;


    @ApiProperty({
        description:"Enter the new password again",
        example:"newpassword"
    })
    @IsNotEmpty()
    @IsString()
    confirm_password:string;
}
