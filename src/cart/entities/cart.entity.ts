import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    product_id:number;

    @Column()
    product_quantity:number;

    @Column()
    user_id:number;
}

