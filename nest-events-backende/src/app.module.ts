import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';
import { AppJapanServices } from './app.japan.services';
import { AppDummyServices } from './app.dummy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(
      //envFilePath: ['.production.env', '.staging.env'],
    ), //es importante configurar para ver las para enviroments
    TypeOrmModule.forRoot({
      type:'mysql',
      host:process.env.DB_HOST, //docker ip container
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities:[Event], 
      synchronize: true
    }),
    EventsModule 
  ],
  controllers: [
    AppController
  ],
  providers: [{
    provide : AppService,
    useClass: AppJapanServices  //AppService  //cambiamos el provedor que seria la clase que responde
  },{
    provide:'APP_NAME',
    useValue:'Nest Events Backend!'
  },{
    provide :'MESSAGE',
    inject: [AppDummyServices],
    useFactory: (app) => `${app.dummy()} Factory!`
  },AppDummyServices],
})
export class AppModule {}
