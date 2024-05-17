
import { Cart } from "src/modules/cart/entities/cart.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column({ default: "user" }) // Set default value to "user"
    roles: string;

    @Column({default:"not_available"})
    token:string;

    @OneToOne(()=>Cart,cart=>cart.user,{eager:true})
    @JoinColumn()
    cart:Cart

    @OneToMany(()=>Order
    ,order=>order.user,{eager:true})
    orders:Order[]

    
}
