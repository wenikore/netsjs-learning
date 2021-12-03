import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { Event } from './event.entity';

@Injectable()
export class EventServices{
    private readonly logger = new Logger(EventServices.name);
 
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository : Repository<Event> 
    ){}

    private getEventsBaseQuery(){
        return this.eventsRepository
            .createQueryBuilder('e')
            .orderBy('e.id','DESC');
    }

    public getEventsWithAttendeeCountQuery(){
        return this.getEventsBaseQuery()
            .loadRelationCountAndMap( //recargas las relaciones de las tablas
                'e.attendeeCount','e.attendee'
            )
            .loadRelationCountAndMap(
              'e.attendeeAccepted', 
              'e.attendee',
              'attendee',
              (qb) => qb .where(
                  'attendee.answer = :answer',
                  {answer: AttendeeAnswerEnum.Accepted}
                )
            )
            .loadRelationCountAndMap(
                'e.attendeeMaybe', 
                'e.attendee',
                'attendee',
                (qb) => qb .where(
                    'attendee.answer = :answer',
                    {answer: AttendeeAnswerEnum.Maybe}
                  )
              )
              .loadRelationCountAndMap(
                'e.attendeeRejected', 
                'e.attendee',
                'attendee',
                (qb) => qb .where(
                    'attendee.answer = :answer',
                    {answer: AttendeeAnswerEnum.Rejected}
                  )
              )              
    }


    public async getEventAttendee(id : number): Promise<Event | undefined> {
        const query= await this.getEventsWithAttendeeCountQuery()
            .andWhere('e.id =:id',{id});

        this.logger.debug(query.getSql());
        return await query.getOne();    
    }


    public async getEvent(id : number): Promise<Event | undefined> {
        const query= await this.getEventsBaseQuery()
            .andWhere('e.id =:id',{id});

        this.logger.debug(query.getSql());
        return await query.getOne();    
    }


}