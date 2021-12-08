import { Event } from "src/events/event.entity";
import { Column, Entity, JoinColumn, OneToOne,OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  username: string;

  @Column()
  password: string;

  @Column({unique:true})
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => Profile,{
      cascade:true
  })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Event,(event)=> event.organizer)
  organized:Event[]

}