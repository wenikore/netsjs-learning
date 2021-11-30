import { Column, Entity, PrimaryGeneratedColumn ,OneToMany } from "typeorm";
import { Attendee } from "./attendee.entity";

@Entity('event',{name:'event'})
export class Event {
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({length:100})
    name: string;

    @Column()
    description: string;

    @Column({name:'when_date'})
    when: Date;

    @Column()
    address: string;

    @OneToMany(() => Attendee,(attendee) => attendee.event,{
        eager:true,
        cascade:true //insercion en cascada y update
    })
    attendee:Attendee[];
}