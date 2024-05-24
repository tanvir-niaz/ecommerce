import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Promo {
    
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string;

    @Column({nullable:true})
    discount:number;

    @Column({default:false})
    isAvailed:boolean;

    @ManyToOne(()=>User,user=>user.promos)
    user:User;

    @CreateDateColumn()
    createdAt: Date;
}
