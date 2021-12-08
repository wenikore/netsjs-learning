import { User } from "src/auth/user.entity";
import { Column, Entity,ManyToOne, JoinColumn,PrimaryGeneratedColumn ,OneToMany } from "typeorm";
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

    @ManyToOne(()=> User,(user)=> user.organized)
    @JoinColumn({name:'organizerId'})
    organizer:User;

    @Column({nullable:true})
    organizerId:number;

    attendeeCount?:number;
    
    attendeeRejected?:number;
    
    attendeeMaybe?:number;
    
    attendeeAccepted?:number;
    
}