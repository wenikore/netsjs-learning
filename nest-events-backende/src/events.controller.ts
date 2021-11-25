import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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
    async findOne(@Param('id') id) {
        const event = await this.repository.findOne(id);

        return event;
    }

    @Post('')
    async create(@Body() input:CreateEventDto) {
      return await this.repository.save({
            ...input,
            when: input.when ? new Date(input.when) : new Date,            
        })
        
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input:UpdateEventDto) {
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

}