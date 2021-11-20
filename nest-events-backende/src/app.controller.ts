import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() //controller decoration se puede incluir un prefijo 'events' 
//{ path: '/events'}
export class AppController {
  constructor(private readonly appService: AppService) {}

  //method asociado al metodo get
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  //cada metodo contiene GET;POST;DELETE;PUT

  @Get('/bye')
  getBye(){
    return "Bye!"
  }
}
