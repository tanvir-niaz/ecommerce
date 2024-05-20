
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { User } from "src/modules/user/entities/user.entity";


@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({default:0})
    // user_id:number;
    @Column({nullable:true})
    cartId:number;

    @Column()
    shipping_address:string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;


    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    items: OrderItem[];
}
