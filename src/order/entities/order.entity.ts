import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    order_id: number;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    cart_id:number;

    @Column()
    product_id:number;
}