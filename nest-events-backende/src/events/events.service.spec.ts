
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./event.entity";
import { EventServices } from "./events.services";


//cargar utilidades, token.etc...
describe('EventsService', () => {
  let service: EventServices;
  let repository: Repository<Event>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventServices,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
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

        const findOneSpy = await jest.spyOn(repository,'findOne')
        .mockResolvedValue({ id:1 } as Event).mockName;        
        expect(repoSpy).not.toBe(null)
    });

  });
})