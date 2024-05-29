import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { PromosService } from "./promos.service";
import { CreatePromoDto } from "./dto/create-promo.dto";
import { UpdatePromoDto } from "./dto/update-promo.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/user.guard";
import { JwtAdminAuthGuard } from "src/guards/admin.guard";
import { AddPromoDto } from "./dto/add-promo.dto";

@Controller("promos")
@ApiBearerAuth("access-token")
@ApiTags("promos")
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Post('/admin')
  @UseGuards(JwtAdminAuthGuard)
  create(@Body() createPromoDto: CreatePromoDto) {
    return this.promosService.create(createPromoDto);
  }

  @Post("/user")
  @UseGuards(JwtAuthGuard)
  addPromo(@Body() addPromoDto: AddPromoDto, @Req() req: any) {
    return this.promosService.addPromoByUser(addPromoDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.promosService.findAll();
  }

  @Get(":id")
  findOne(@Param("id",ParseIntPipe) id: number) {
    return this.promosService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAdminAuthGuard)
  update(@Param("id",ParseIntPipe) id: number, @Body() updatePromoDto: UpdatePromoDto) {
    return this.promosService.update(id, updatePromoDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.promosService.remove(id);
  }
}
