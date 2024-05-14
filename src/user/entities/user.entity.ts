import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column({ default: "user" }) // Set default value to "user"
    roles: string;

    @Column({default:"not_available"})
    token:string;

    
}
