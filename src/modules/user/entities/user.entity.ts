
import { Exclude } from "class-transformer";
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

    @Exclude()
    @Column()
    password:string;


    @Exclude()
    @Column({ default: "user" }) // Set default value to "user"
    roles: string;

    @Exclude()
    @Column({
        nullable:true
    })
    token:string;

    @OneToOne(()=>Cart,cart=>cart.user,{eager:true})
    @JoinColumn()
    cart:Cart

    @Exclude()
    @OneToMany(()=>Order
    ,order=>order.user,{eager:true})
    orders:Order[]

    
}
