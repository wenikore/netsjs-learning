import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';

//it is static module
@Module({
    imports:[
        TypeOrmModule.forFeature([Event,Attendee]), //es necesario para haces ya inyeccion de dependencia
    ],
    controllers:[
        EventsController
    ]
})
export class EventsModule {}
