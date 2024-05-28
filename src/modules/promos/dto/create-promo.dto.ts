import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsDateString } from "class-validator";

export class CreatePromoDto {
  @ApiProperty({ example: "SUMMER24" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  validTill: Date;

  @ApiProperty({ example: 25 })
  @IsNotEmpty()
  discount: number;
}
