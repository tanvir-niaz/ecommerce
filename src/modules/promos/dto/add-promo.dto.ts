import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddPromoDto {
  @ApiProperty({ example: "SUMMER24" })
  @IsNotEmpty()
  name: string;
}
