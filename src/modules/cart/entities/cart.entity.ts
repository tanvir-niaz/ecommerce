import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartItem } from "./cart-item.entity";
import { User } from "src/modules/user/entities/user.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // delivery_type:[]

  @Column({ default: 0, nullable: true })
  subTotal: number;

  @Column({ default: 0, nullable: true })
  totalDiscount: number;

  @Column({ default: 0, nullable: true })
  totalPriceAfterDiscount: number;

  @Column({default:40})
  delivery_charge:number;

  @Column({ nullable: true })
  promoCodeId: number;

  @Column({ nullable: true })
  promoCode: string;

  @Column({ default: 0 })
  priceAfterPromoCode: number;

  @Column({default:0})
  totalPrice:number;

  @Column({default:false})
  promoApplied:boolean;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (CartItem) => CartItem.cart, { cascade: true ,nullable:true})
  items: CartItem[];
}
