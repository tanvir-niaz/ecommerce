import { CartItem } from "src/modules/cart/entities/cart-item.entity";
import { Review } from "src/modules/reviews/entities/review.entity";
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

    @Column({default:0})
    discount:number;

    @Column({nullable:true})
    discountPrice:number;

    @Column()
    stockQuantity:number;

    @Column()
    category:string;

    
    @OneToMany(() => Product, cartItem => cartItem.id)
    cartItem: CartItem;


    @OneToMany(()=>Review,(review)=>review.product)
    reviews:Review[];
}
