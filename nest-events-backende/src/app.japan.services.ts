import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppJapanServices{
    
  constructor(
    @Inject('APP_NAME')
    private readonly name:string,
    @Inject('MESSAGE')
    private readonly message:string,
    private configService: ConfigService,
  ){}


    getHello(): string {
        console.log(process.env.HOLA)
        console.log(process.env.DB_HOST)
        
        return `こんにちは世界! from ${this.name}, ${this.message}`;
    }

}