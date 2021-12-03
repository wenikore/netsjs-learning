import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventServices } from './events.services';

//it is static module
@Module({
    imports:[
        TypeOrmModule.forFeature([Event,Attendee]), //es necesario para haces ya inyeccion de dependencia
    ],
    controllers:[
        EventsController
    ],
    providers: [EventServices]
})
export class EventsModule {}
