import { User } from "src/user/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Cart } from "src/cart/entities/cart.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => Cart)
    cart: Cart;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    items: OrderItem[];
}