import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';

@Controller({
    path: '/events'
})
export class EventsController {

    private events:Event[] = []


    @Get('')
    findAll() {
        return this.events;
    }

    @Get(':id')
    findOne(@Param('id') id) {
        const event =this.events.find(
            event => event.id===parseInt(id)
        );

        return event;
    }

    @Post('')
    create(@Body() input:CreateEventDto) {
        const event ={
            ...input,
            when: input.when ? new Date(input.when) : new Date,
            id: this.events.length + 1
        }
        this.events.push(event);
        return event;
    }

    @Patch(':id')
    update(@Param('id') id, @Body() input:UpdateEventDto) {
        const  index= this.events.findIndex(
            events => events.id=== parseInt(id)
        );

        this.events[index]={
            ... this.events[index],
            ... input,
                when: input.when ? new Date(input.when) : this.events[index].when
            }

        return this.events[index]
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id) {
        this.events = this.events.filter(
            events => events.id != parseInt(id)
        );
    }

}