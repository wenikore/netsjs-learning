import { Body, ConsoleLogger, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Like, MoreThan, Repository } from "typeorm";

@Controller({
    path: '/events'
})
export class EventsController {

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event> 
    ){}


    @Get('')
    async findAll() {
        return await this.repository.find();
    }

    @Get(':id')
    async findOne(@Param('id',ParseIntPipe) id:number) {
        // console.log(typeof id);
        const event = await this.repository.findOne(id);
        return event;
    }

    //@UsePipes()
    @Post('')
    async create(@Body(new ValidationPipe({groups:['create']})) input:CreateEventDto) {
      return await this.repository.save({
            ...input,
            when: input.when ? new Date(input.when) : new Date,            
        })
        
    }

    @Patch(':id')
    async update(
       @Param('id') id,
       @Body(new ValidationPipe({groups:['update']})) input:UpdateEventDto
    ) {
       const event = await this.repository.findOne(id);
       return await this.repository.save({
              ...event,
              ...input,
              when: input.when ? new Date(input.when) : new Date,            
          });
        
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id) {
        const event = await this.repository.findOne(id);
        await this.repository.remove(event);
    }

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


}