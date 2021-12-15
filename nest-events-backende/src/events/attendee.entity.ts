import { Expose } from "class-transformer";
import { User } from "./../auth/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne,JoinColumn } from "typeorm";
import { Event } from "./event.entity";
 
export enum AttendeeAnswerEnum {
    Accepted = 1,
    Maybe,
    Rejected
  }


@Entity('attendee',{name:'attendee'})
export class Attendee{
    @PrimaryGeneratedColumn()
    @Expose()
    id:number;

    // @Column()
    // @Expose()
    // name:string

    @ManyToOne(() => Event, (event) => event.attendee,{
        nullable:true,
        onDelete:'CASCADE'
    })
    @JoinColumn(/*{name:'event_id', referencedColumnName:'secondary'}*/)
    event:Event

    @Column()
    eventId:number;

    @Column('enum',{
        enum:AttendeeAnswerEnum,
        default:AttendeeAnswerEnum.Accepted
    })
    @Expose()
    answer : AttendeeAnswerEnum

    @ManyToOne(()=>User,(user)=>user.attended)
    @Expose()    
    user:User

    @Column()
    userId:number;
}
