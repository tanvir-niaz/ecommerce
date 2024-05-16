import { Cart } from "src/cart/entities/cart.entity";
import { Order } from "src/order/entities/order.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



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

    @OneToOne(()=>Cart,cart=>cart.user)
    cart:Cart

    @OneToMany(()=>Order,order=>order.user,{eager:true})
    orders:Order

    
}
