import { Expose } from "class-transformer";
import { Attendee } from "./../events/attendee.entity";
import { Event } from "./../events/event.entity";
import { Column, Entity, JoinColumn, OneToOne,OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({unique:true})
  @Expose()
  username: string;

  @Column()
  password: string;

  @Column({unique:true})
  @Expose()
  email: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @OneToOne(() => Profile,{
      cascade:true
  })
  @Expose()
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToMany(() => Event,(event)=> event.organizer)
  @Expose() 
  organized:Event[]

  @OneToMany(() => Attendee,(attendee)=> attendee.user)
  @Expose()
  attended:Attendee[]

}