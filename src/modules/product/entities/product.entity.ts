import { CartItem } from "src/modules/cart/entities/cart-item.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    description:string;


    @Column()
    price:number;

    @Column()
    stockQuantity:number;

    @Column()
    category:string;

    
    @OneToMany(() => Product, cartItem => cartItem.id)
    
    cartItem: CartItem;

    
}