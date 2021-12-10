import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity,ManyToOne, JoinColumn,PrimaryGeneratedColumn ,OneToMany } from "typeorm";
import { Attendee } from "./attendee.entity";

@Entity('event',{name:'event'})
export class Event {
    @PrimaryGeneratedColumn()
    @Expose()
    id:number
    
    @Column({length:100})
    @Expose()
    name: string;

    @Column()@Expose()
    description: string;

    @Column({name:'when_date'})
    @Expose()
    when: Date;

    @Column()@Expose()
    address: string;

    @OneToMany(() => Attendee,(attendee) => attendee.event,{
        eager:true,
        cascade:true //insercion en cascada y update
    })
    @Expose()
    attendee:Attendee[];

    @ManyToOne(()=> User,(user)=> user.organized)
    @JoinColumn({name:'organizerId'})
    @Expose()
    organizer:User;

    @Column({nullable:true})
    organizerId:number;

    @Expose()
    attendeeCount?:number;
    
    @Expose()
    attendeeRejected?:number;
    
    @Expose()
    attendeeMaybe?:number;
    
    @Expose()
    attendeeAccepted?:number;
    
}