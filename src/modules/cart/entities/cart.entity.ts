
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { User } from "src/modules/user/entities/user.entity";



@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id:number;

    // @Column()
    // delivery_type:[]

    @Column({default:0,nullable:true})
    totalPrice:number;

    @Column({default:0,nullable:true})
    totalDiscount:number;



    @Column({default:0,nullable:true})
    totalPriceAfterDiscount:number;

    @Column({nullable:true})
    promoCode:string;

    @Column({default:0})
    priceAfterPromoCode:number;

    @OneToOne(()=>User,user=>user.cart)
    @JoinColumn()
    user:User;

    @OneToMany(()=>CartItem,CartItem=>CartItem.cart,{cascade:true})
    items:CartItem[];

}

