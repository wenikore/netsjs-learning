import { Column, Entity, PrimaryGeneratedColumn, ManyToOne,JoinColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity('attendee',{name:'attendee'})
export class Attendee{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string

    @ManyToOne(() => Event, (event) => event.attendee,{
        nullable:false
    })
    @JoinColumn(/*{name:'event_id', referencedColumnName:'secondary'}*/)
    event:Event
}