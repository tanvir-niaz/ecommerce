import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";

import { JwtAdminAuthGuard } from "src/guards/admin.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service";
import { userInterceptor } from "./interceptors/user.interceptor";
import { QueryUser } from "./dto/queryUser.dto";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get()
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(userInterceptor)
  @ApiBearerAuth("access-token")
  findAll(@Query() userQuery: QueryUser) {
    return this.userService.findAll(userQuery);
  }

  @Get(":userId")
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(userInterceptor)
  @ApiBearerAuth("access-token")
  async findOne(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.findOneUserById(userId);
  }

  @Delete(":userId")
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth("access-token")
  remove(@Param("userId", ParseIntPipe) userId: number) {
    this.userService.remove(userId);
    return {
      statusCode: HttpStatus.ACCEPTED,
      error: null,
      message: "User deleted ",
    };
  }
}
