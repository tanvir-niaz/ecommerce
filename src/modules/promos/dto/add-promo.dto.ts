import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class AddPromoDto {
  @ApiProperty({ example: 33 })
  @IsNotEmpty()
  @IsInt()
  id: number;
}
