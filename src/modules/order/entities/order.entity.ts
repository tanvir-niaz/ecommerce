import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { OrderItem } from "./order-item.entity";
import { User } from "src/modules/user/entities/user.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({default:0})
  // user_id:number;
  @Column({ nullable: true })
  cartId: number;

  @Column()
  shipping_address: string;

  // @Column()
  // promoCode: string;

  @Column({nullable:true})
  promoCodeId: number;

  @Column()
  priceAfterPromoCode: number;

  @Column({ default: 0, nullable: true })
  subTotal: number;

  @Column({ default: 0, nullable: true })
  totalDiscount: number;

  @Column({ default: 0, nullable: true })
  totalPriceAfterDiscount: number;

  @Column({ default: 0, nullable: true })
  totalPrice: number;

  @Column({ nullable: true })
  contact_number: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order,{cascade:true,onDelete:"CASCADE"})
  items: OrderItem[];
}
