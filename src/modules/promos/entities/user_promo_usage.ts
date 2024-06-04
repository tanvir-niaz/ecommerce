import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Promo } from "./promo.entity";
import { User } from "src/modules/user/entities/user.entity";

@Entity()
export class User_promo_usage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({default:0})
    usage_count:number;

    @ManyToOne(()=>User,(user)=>user.user_promo_usage)
    user:User

    @ManyToOne(()=>Promo,(promo)=>promo.user_promo_usage)
    promo:Promo;
}