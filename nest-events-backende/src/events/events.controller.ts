import { BadRequestException, Body,  ClassSerializerInterceptor,  Controller, Delete, ForbiddenException, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Like, MoreThan, Repository } from "typeorm";
import { Attendee } from './attendee.entity';
import { EventServices } from './events.services';
import { ListEvent } from './input/list.event';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';



@Controller({
    path: '/events'
})
@SerializeOptions({
  strategy: 'excludeAll'
})
export class EventsController {
  
  private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event> ,
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>,
        private readonly eventServices :EventServices
      
    ){}

 //====================Ejemplos de consultas====================
    //se puede hacer consultar especificando el id
    //select * from event where event.id=3
    @Get('/practice')
    async practice() {
        return await this.repository.find({
            select: ['id', 'when'],
            where: [{
              id: MoreThan(3),
              when: MoreThan(new Date('2021-02-12T13:00:00'))
            }, {
              description: Like('%meet%')
            }],
            take: 2,
            order: {
              id: 'DESC'
            }
          });
    }

    @Get('/practice2')
    async practiceTwo() {
    const data= this.repository.createQueryBuilder("event")    
    .where("event.id like >=3  ")
    .select(["event.id", "event.id"])
    .execute();
    
    if (data) {
        return data;
      } else {
        return undefined;
      }
    }

    @Get('/testing')
    async practiceThree() {
      this.logger.debug("into practicethree")
      //return await this.repository.findOne(1,{
       //loadEagerRelations:false no carga la relaccion de la tabla attendee
       relations:['attendee'] // se indica que cargue la relacion de la tabla y los datos
      //});
    const event =await this.repository.findOne(1);
    // crear un evento
    //const event = new Event()
    //event.id=1  //settear evento existente
    //name="Check data Sources"
    //event.address="Office"
    //event.when = new Date()  

    //asociar tablas
    const attendee = new Attendee();
    attendee.name ='Judith Cascada'
    //attendee.event = event
    event.attendee.push(attendee);

    //await this.attendeeRepository.save(attendee);
    await this.repository.save(event);
    return event;
    }

    @Get('/queryBuilder')
    async queryBuilder (){
      return await this.repository.createQueryBuilder('e')
      .select(['e.id','e.name'])
      .orderBy('e.id','ASC')
      .take(3)
      .getMany();
    }

    @Get('/paginator')
    @UsePipes(new ValidationPipe({transform:true})) //error por falta de aprametro offset
    @UseInterceptors(ClassSerializerInterceptor)
    async findAllpaginator(@Query() filter: ListEvent) {
        this.logger.debug(filter);        
        const events = await this.eventServices
              .getEventsWithAttendeeCountfilteredPaginatorServices(filter,{
                limit:2,
                currentPage:filter.page,
                total:true
              });
        this.logger.debug(`Found ${events.data.length}`);
        return events;
    }

  //====================Ejemplos de consultas FIN====================


    @Get('')
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Query() filter: ListEvent) {
        this.logger.debug(filter);
        this.logger.log(`Hit the findAll route`);
        const events = await this.eventServices
              .getEventsWithAttendeeCountFiltered(filter);
        this.logger.debug(`Found ${events.length}`);
        return events;
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id',ParseIntPipe) id:number) {
        // console.log(typeof id);
        const event = await this.eventServices.getEvent(id);
        if(!event){
          throw new NotFoundException();
        }

        return event;
    }

    @Get('/attendee/:id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOneAttendee(@Param('id',ParseIntPipe) id:number) {        
        const event = await this.eventServices.getEventAttendee(id);
        if(!event){
          throw new NotFoundException();
        }
        return event;
    }

    //===============================Guard and auth======================================
    //@UsePipes()
    //new ValidationPipe({groups:['create']})
    @Post('') 
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(
      @Body() input:CreateEventDto,
      @CurrentUser() user:User)
    {
      return await this.eventServices.createEvent(input,user);        
    }

    //new ValidationPipe({groups:['update']})
    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
       @Param('id') id,
       @Body() input:UpdateEventDto,
       @CurrentUser() user:User
    ) {
       const event = await this.eventServices.getEvent(id);

      if(!event){
        throw new NotFoundException();
      }

      if(event.organizerId !== user.id){
        throw new ForbiddenException(
          null,`You are not authorized to change this event`
        )
      }
      return await this.eventServices.update(event,input);        
    }

    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    @HttpCode(204)
    async remove(
      @Param('id') id,
      @CurrentUser() user:User) {        
     const event = await this.eventServices.getEvent(id);

     if(!event){
      throw new NotFoundException();
    }

    if(event.organizerId !== user.id){
      throw new ForbiddenException(
        null,`You are not authorized to remove this event`
      )
    }    
    const result= await this.eventServices.deleteEvent(id);
        if(result.affected!==1){
          throw new NotFoundException();
        }
      return result;        
    } 

}