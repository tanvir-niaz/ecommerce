import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Promo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: "2024-06-30" })
  @Column({ type: "date" })
  validTill: Date;

  @ApiProperty({ example: 25 })
  @Column({ nullable: true })
  discount: number;

  @Column({ default: false })
  isAvailed: boolean;

  @ManyToOne(() => User, (user) => user.promos)
  user: User;
}
