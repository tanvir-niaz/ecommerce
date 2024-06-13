import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { QueryUser } from "./dto/queryUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  async findAll(userQuery: QueryUser): Promise<[User[], number]> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");

    if (userQuery.name) {
      queryBuilder.andWhere("LOWER(user.name) LIKE LOWER(:name)", {
        name: `%${userQuery.name}%`,
      });
    }

    if (userQuery.email) {
      queryBuilder.andWhere("LOWER(user.email) LIKE LOWER(:email)", {
        email: `%${userQuery.email}%`,
      });
    }
    queryBuilder.leftJoinAndSelect("user.cart", "cart.items");
    const [users, total] = await queryBuilder.getManyAndCount();
    return [users, total];
  }

  async findOne(id: number): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      if (!user) {
        throw new NotFoundException("User not found");
      }
    }
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneUserById(id: number): Promise<object> {
    const user: User = await this.userRepository.findOne({
      where: { id },
      relations: ["cart"],
    });

    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: null,
        message: "Not found any user by that userId",
      };
    }

    return {
      statusCode: HttpStatus.OK,
      error: null,
      message: "User found",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        cart: user.cart,
      },
    };
  }

  async getUserByUserEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
