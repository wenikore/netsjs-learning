import { Controller, Logger, Post } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from "./subject.entity";
import { Teacher } from "./teacher.entity";


@Controller('school')
export class TrainingController {
    private readonly logger = new Logger(TrainingController.name);

  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) { }

  @Post('/create')
  public async savingRelation() {
    this.logger.warn("entro")
     const subjec3 = new Subject();
     subjec3.name = 'Progamation';
     await this.subjectRepository.save(subjec3);

    const subject = await this.subjectRepository.findOne(4);

    //  const teacher1 = new Teacher();
    //  teacher1.name = 'John Doe';

    //  const teacher2 = new Teacher();
    //  teacher2.name = 'Harry Doe';

    //  subject.teachers = [teacher1, teacher2];
    //  this.logger.warn(subject)
    //  await this.subjectRepository.save(subject)
    //await this.teacherRepository.save([teacher1, teacher2]);

    // How to use One to One
    // const user = new User();
    // const profile = new Profile();

    // user.profile = profile;
    // user.profile = null;
    // Save the user here


   const teacher1 = await this.teacherRepository.findOne(1);
   const teacher2 = await this.teacherRepository.findOne(2);
    //asociar subject to teacher
    return await this.subjectRepository
      .createQueryBuilder()
      .relation(Subject, 'teachers')
      .of(subject)
      .add([teacher1, teacher2]);
  }

  @Post('/remove')
  public async removingRelation() {
    //const subject = await this.subjectRepository.findOne(1);    
    //subject.teachers = subject.teachers.filter(teacher => teacher.id !== 2);
    //await this.subjectRepository.save(subject);
    // const subject = await this.subjectRepository.findOne(
    //   1,
    //   { relations: ['teachers'] }
    // );

    // subject.teachers = subject.teachers.filter(
    //   teacher => teacher.id !== 2
    // );

    // await this.subjectRepository.save(subject);
    //esto permitira actualizar los objetos en especifico su nombre en la 
    //DB
    await this.subjectRepository.createQueryBuilder('s')
       .update() //
       .set({ name: "Confidential" })
       .execute();


  }
}