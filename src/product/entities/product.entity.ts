import { Cart } from "src/cart/entities/cart.entity";
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

    
}
