import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { AppJapanServices } from './app.japan.services';
import { AppDummyServices } from './app.dummy';
import { ConfigModule } from '@nestjs/config';
import { SchoolModule } from './school/school.module';
import ormConfig from 'src/config/orm.config';
import ormConfigProd from 'src/config/orm.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath:'../config/production.env',
      isGlobal:true,
      load:[ormConfig],
      expandVariables : true,
      
    }), //es importante configurar para ver las para enviroments
    TypeOrmModule.forRootAsync({  //la db se cargara como factory que esta en un archivo 
      useFactory: process.env.NODE_ENV != 'production' ? ormConfig :ormConfigProd
    }),
    EventsModule,
    SchoolModule 
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
