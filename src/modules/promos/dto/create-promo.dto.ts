import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsDateString } from "class-validator";

export class CreatePromoDto {
  @ApiProperty({ example: "SUMMER24" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "2024-06-30" })
  @IsNotEmpty()
  @IsDateString()
  validTill: string;

  @ApiProperty({ example: 25 })
  @IsNotEmpty()
  discount: number;
}
