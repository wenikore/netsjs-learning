import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Profile } from './../auth/profile.entity';
import { User } from './../auth/user.entity';
import { Attendee } from './../events/attendee.entity';
import { Subject } from './../school/subject.entity';
import { Teacher } from './../school/teacher.entity';
import { Event } from './../events/event.entity';

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions=>({
        type:'mysql',
        host:process.env.DB_HOST, //docker ip container
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities:[Event,Attendee,Subject,Teacher,User,Profile], 
        synchronize: true
    })
);