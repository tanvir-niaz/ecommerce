import { IsInt } from "class-validator";
import { Product } from "src/modules/product/entities/product.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    review:string;

    @CreateDateColumn()
    review_at:Date;
    
    @Column()
    @IsInt()
    rating:number;

    @ManyToOne(()=>User,(user)=>user.reviews)
    user:User;

    @ManyToOne(()=>Product,(product)=>product.reviews)
    product:Product;


}
