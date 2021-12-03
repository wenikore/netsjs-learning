import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./teacher.entity";


@Entity('subject',{name:'subject'})
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    () => Teacher, (teacher) => teacher.subjects, { cascade: true, eager:true }
  )
  @JoinTable()
  teachers: Teacher[];
}