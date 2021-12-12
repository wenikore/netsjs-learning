import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { EventServices } from "./events.services";

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController{
    constructor(
        private readonly eventsService:EventServices
    ){}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(
        @Param('userId',ParseIntPipe) userId:number,
        @Query('page',new DefaultValuePipe(1)) page=1
    ){
        return await this.eventsService
        .getEventsOrganizedByUserIdPaginated(userId,{currentPage:page,limit:5})
    }
}