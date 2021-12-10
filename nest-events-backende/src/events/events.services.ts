import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository , DeleteResult } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { Event } from './event.entity';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { ListEvent, WhenEventFilter } from "./input/list.event";
import { CreateEventDto } from "./input/create-event.dto";
import { User } from "src/auth/user.entity";
import { UpdateEventDto } from "./input/update-event.dto";


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
            .orderBy('e.id','ASC');
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


    public async getEventsWithAttendeeCountFiltered(filter?: ListEvent) {
        let query = this.getEventsWithAttendeeCountQuery();

        if(!filter){
            return query.getMany();
        }
        if(filter.when){
            if(filter.when == WhenEventFilter.Today){
                query = query.andWhere(
                    `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`  
                )
            }
            if(filter.when == WhenEventFilter.Tommorow){
                query = query.andWhere(
                    `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY` 
                )
            }
            if(filter.when == WhenEventFilter.ThisWeek){
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
            }
            if(filter.when == WhenEventFilter.NextWeek){
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1');
            }
        }

        this.logger.debug(query.getSql());
        return  await query.getMany()

    }

    public async getEvent(id : number): Promise<Event | undefined> {
        const query= await this.getEventsBaseQuery()
            .andWhere('e.id =:id',{id});

        this.logger.debug(query.getSql());
        return await query.getOne();    
    }

    private async getEventsWithAttendeeCountPaginator(filter?: ListEvent) {
        let query = this.getEventsWithAttendeeCountQuery();

        if(!filter){
            return query;
        }
        if(filter.when){
            if(filter.when == WhenEventFilter.Today){
                query = query.andWhere(
                    `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`  
                )
            }
            if(filter.when == WhenEventFilter.Tommorow){
                query = query.andWhere(
                    `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY` 
                )
            }
            if(filter.when == WhenEventFilter.ThisWeek){
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
            }
            if(filter.when == WhenEventFilter.NextWeek){
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1');
            }
        }

        this.logger.debug(query.getSql());
        return query;
    }


    public async getEventsWithAttendeeCountfilteredPaginatorServices(
        filter: ListEvent,
        paginateOptions:PaginateOptions
    ){
        return await paginate(
            await this.getEventsWithAttendeeCountPaginator(filter),
            paginateOptions
        );
    }

    public async deleteEvent(id:number):Promise<DeleteResult>{
        return await this.eventsRepository
        .createQueryBuilder('e')
        .delete()
        .where('id = :id',{id})
        .execute();
    }

    public async createEvent(input:CreateEventDto,user:User):Promise<Event>{
        return await this.eventsRepository.save({
            ...input,
            organizer:user,
            when: input.when ? new Date(input.when) : new Date,            
        })
    }

    public async update(event:Event,input:UpdateEventDto):Promise<Event>{
       return await this.eventsRepository.save({
        ...event,
        ...input,
        when: input.when ? new Date(input.when) : new Date,            
    });
    }

}