
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { User } from "src/modules/user/entities/user.entity";



@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id:number;

    // @Column()
    // delivery_type:[]

    @OneToOne(()=>User,user=>user.cart)
    @JoinColumn()
    user:User;

    @OneToMany(()=>CartItem,CartItem=>CartItem.cart,{cascade:true})
    items:CartItem[];

}

