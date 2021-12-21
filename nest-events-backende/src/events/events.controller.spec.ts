import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from './../auth/user.entity';
import { Attendee } from "./attendee.entity";
import { Event } from './event.entity';
import { EventsController } from "./events.controller";
import { EventServices } from "./events.services";
import { ListEvent } from "./input/list.event";



//grupo de test
describe('EventsController',()=>{
    let eventsController:EventsController;
    let eventsService:EventServices;
    let eventsRepository: Repository<Event>;

    let attendeeRepository: Repository<Attendee>;

    //setup
    //beforeAll(()=>{console.log('this logged once') })
    beforeEach(()=>{
        eventsService = new EventServices(eventsRepository);
        eventsController = new EventsController(
                                                eventsRepository,
                                                attendeeRepository,
                                                eventsService);
        //console.log('this would pop up twice')
    })


    //test
    it('should return a list of events',async ()=>{
        const result = {
            first: 1,
            last: 1,
            limit: 10,
            data: []
          };
        //test bussiness with mocks
        //  eventsService.getEventsWithAttendeeCountfilteredPaginatorServices
        //  = jest.fn().mockImplementation((): any => result);

        //spy
        const spy =jest.spyOn(eventsService,'getEventsWithAttendeeCountfilteredPaginatorServices')
        .mockImplementation((): any => result);

        expect(await eventsController.findAllpaginator(new ListEvent()))
        .toEqual(result);

        expect(spy).toBeCalledTimes(1);
    });

    it('should not delete an event, when it\'s not found',async ()=>{
        const deletespy =jest.spyOn(eventsService,'deleteEvent');
        const findSpy =jest.spyOn(eventsService,'findOne')
        .mockImplementation(():any=>undefined);
        
        try{
            await eventsController.remove(1,new User());
        }catch(error){
            expect(error).toBeInstanceOf(NotFoundException);
        }
        expect(deletespy).toBeCalledTimes(0);
        expect(findSpy).toBeCalledTimes(1);

    });

});