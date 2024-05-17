
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Cart } from "src/modules/cart/entities/cart.entity";


@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({default:0})
    // user_id:number;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => Cart)
    cart: Cart;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    items: OrderItem[];
}
