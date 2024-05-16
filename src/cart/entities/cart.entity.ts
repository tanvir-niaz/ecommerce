import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";



@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(()=>User)
    @JoinColumn()
    user:User;

    @OneToMany(()=>CartItem,CartItem=>CartItem.cart)
    items:CartItem[];


}

