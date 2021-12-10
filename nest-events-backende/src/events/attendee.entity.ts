import { Expose } from "class-transformer";
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

    @Column()
    @Expose()
    name:string

    @ManyToOne(() => Event, (event) => event.attendee,{
        nullable:false
    })
    @JoinColumn(/*{name:'event_id', referencedColumnName:'secondary'}*/)
    event:Event

    @Column('enum',{
        enum:AttendeeAnswerEnum,
        default:AttendeeAnswerEnum.Accepted
    })
    @Expose()
    answer : AttendeeAnswerEnum

}