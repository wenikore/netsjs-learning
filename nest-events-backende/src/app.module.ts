import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'172.18.0.4', //docker ip container
      port: 3306,
      username:'root',
      password:'example',
      database:'nest-events',
      entities:[Event],
      synchronize: true
    })
  ],
  controllers: [
    AppController,
    EventsController
  ],
  providers: [AppService],
})
export class AppModule {}
