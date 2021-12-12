import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { query } from "express";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AuthGuardJwt } from './../auth/auth-guard.jwt';
import { AttendeesService } from "./attendees.service";
import { EventServices } from "./events.services";
import { CreateAttendeeDto } from "./input/create-attendee.dto";

@Controller('events-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendanceController {
    constructor(
        private readonly eventServices:EventServices,
        private readonly attendeesServices:AttendeesService,
    ){ }

    @Get()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(        
        @CurrentUser() user:User,
        @Query('page',new DefaultValuePipe(1)) page=1
    ){
        return await this.eventServices
        .getEventsAttendedByUserIdPaginated(
            user.id, { limit: 6, currentPage: page }
        );

    }


    @Get(':eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(
        @Param('eventId',ParseIntPipe) eventId:number,
        @CurrentUser()user:User
    ){
    const attendee = await this.attendeesServices
      .findOneByEventIdAndUserId(
          eventId,
          user.id
    ); 
    if (!attendee) {
        throw new NotFoundException();
      }
  
      return attendee;
    }


    @Put('/:eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async createOrUpdate(
        @Param('eventId',ParseIntPipe) eventId:number,
        @Body() input:CreateAttendeeDto,
        @CurrentUser()user:User
    ){
        return this.attendeesServices.createOrUpdate(
            input,
            eventId,
            user.id
        );
    }    
}