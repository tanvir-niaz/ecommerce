import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User_promo_usage } from "./user_promo_usage";

enum DiscountOn {
  TotalPrice = 'totalPrice',
  DeliveryCharge = 'deliveryCharge',
}

@Entity()
export class Promo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: "2024-06-30" })
  @Column({ type: "date" })
  validTill: Date;

  @ApiProperty({ example: 25 })
  @Column({ nullable: true })
  discount: number;

  @Column({default:1})
  usage_limit: number;


  @Column({ type: 'enum', enum: DiscountOn, default: DiscountOn.TotalPrice })
  discount_on: DiscountOn;
   

  @Column()
  min_price:number;

  @OneToMany(()=>User_promo_usage,(user_promo_usage)=>user_promo_usage.promo)
  user_promo_usage:User_promo_usage[];
}

