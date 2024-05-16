import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";


@Entity()

export class CartItem{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Cart,cart=>cart.items)
    cart:Cart;

    @ManyToOne(() => Product, product => product.id)
    @JoinColumn()
    product: Product;

    @Column()
    quantity: number;

}