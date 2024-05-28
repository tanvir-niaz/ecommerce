import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "src/modules/product/entities/product.entity";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.id,{onDelete:"CASCADE"})
  @JoinColumn()
  product: Product;

  @DeleteDateColumn({ type: "time without time zone", nullable: true })
  deletedAt: Date;

  @Column()
  quantity: number;
}
