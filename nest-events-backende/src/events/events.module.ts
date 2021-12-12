import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventServices } from './events.services';
import { EventAttendeesController } from './event-attendees.controller';
import { AttendeesService } from './attendees.service';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';

//it is static module
@Module({
    imports:[
        TypeOrmModule.forFeature([Event,Attendee]), //es necesario para haces ya inyeccion de dependencia
    ],
    controllers:[
        EventsController,
        EventAttendeesController,
        EventsOrganizedByUserController,
        CurrentUserEventAttendanceController
    ],
    providers: [EventServices,AttendeesService]
})
export class EventsModule {}
