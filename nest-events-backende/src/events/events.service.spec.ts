
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./event.entity";
import { EventServices } from "./events.services";
import * as paginator from './../pagination/paginator';

jest.mock('./../pagination/paginator'); //create mock
//cargar utilidades, token.etc...
describe('EventsService', () => {
  let service: EventServices;
  let repository: Repository<Event>;
  let selectQb;
  let deleteQb;
  let mockedPaginate;

  beforeEach(async () => {
    mockedPaginate = paginator.paginate as jest.Mock;
    deleteQb = {
        where: jest.fn(),
        execute: jest.fn()
      }
  
      selectQb = {
        delete: jest.fn().mockReturnValue(deleteQb),
        where: jest.fn(),
        execute: jest.fn(),
        orderBy: jest.fn(),
        leftJoinAndSelect: jest.fn()
      };

    const module = await Test.createTestingModule({
      providers: [
        EventServices,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
            findOne: jest.fn(),
          }
        }
      ]
    }).compile();

    service = module.get<EventServices>(EventServices);
    repository = module.get<Repository<Event>>(
      getRepositoryToken(Event)
    );
  });

  //create group
  describe('updateEvent', () => {
    it('should update the event', async () => {
        let dateUpdate=new Date().toISOString().slice(0, 10);        
        const repoSpy =jest.spyOn(repository,'save')
        .mockResolvedValue({ id:1 } as Event);
        expect(service.update(new Event({ id:1, when:new Date(dateUpdate) }),{
            name:'New name'
        })).resolves.toEqual({ id:1 });

        // const findOneSpy = await jest.spyOn(repository,'findOne')
        // .mockResolvedValue({ id:1 } as Event).mockName;        
        expect(repoSpy).not.toBe(null)
    });
  });

  describe('deleteEvent',()=>{
    it('Should delete an event',async()=>{
        const createQueryBuilderSpy = jest.spyOn(
            repository, 'createQueryBuilder'
          );
          const deleteSpy = jest.spyOn(
            selectQb, 'delete'
          ).mockReturnValue(deleteQb);
          const whereSpy = jest.spyOn(
            deleteQb, 'where'
          ).mockReturnValue(deleteQb);
          const executeSpy = jest.spyOn(
            deleteQb, 'execute'
          );
    
          expect(service.deleteEvent(1)).resolves.toBe(undefined);
    
          expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
          expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');
    
          expect(deleteSpy).toHaveBeenCalledTimes(1);
          expect(whereSpy).toHaveBeenCalledTimes(1);
          expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 1 });
          expect(executeSpy).toHaveBeenCalledTimes(1);       

    });
  });

  describe('getEventsAttendedByUserIdPaginated', () => {
    it('should return a list of paginated events', async () => {
      const orderBySpy = jest.spyOn(selectQb, 'orderBy')
        .mockReturnValue(selectQb);
      const leftJoinSpy = jest.spyOn(selectQb, 'leftJoinAndSelect')
        .mockReturnValue(selectQb);
      const whereSpy = jest.spyOn(selectQb, 'where')
        .mockReturnValue(selectQb);

        mockedPaginate.mockResolvedValue({
            first: 1, last: 1, total: 10, limit: 10, data: []
            });
    
        expect(service.getEventsAttendedByUserIdPaginated(
            500,
            { limit: 1, currentPage: 1 }
        )).resolves.toEqual({
            data: [],
            first: 1,
            last: 1,
            limit: 10,
            total: 10
        });


        expect(orderBySpy).toBeCalledTimes(1);
        expect(orderBySpy).toBeCalledWith('e.id', 'ASC');

        expect(leftJoinSpy).toBeCalledTimes(1);
        expect(leftJoinSpy).toBeCalledWith('e.attendee', 'a');

        expect(whereSpy).toBeCalledTimes(1);
        expect(whereSpy).toBeCalledWith(
            'a.userId = :userId', { userId: 500 }
        );

        expect(mockedPaginate).toBeCalledTimes(1);
        expect(mockedPaginate).toBeCalledWith(
            selectQb,
            { currentPage: 1, limit: 1 }
        );
    });
  });
})