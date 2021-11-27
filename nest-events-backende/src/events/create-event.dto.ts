import { IsDateString, IsString, Length } from "class-validator";


export class CreateEventDto {
    @IsString()
    @Length(5,255,{message:'The name length is wrong'})
    name: string;
    
    @Length(5,255)
    description: string;
    
    @IsDateString()
    when: string;
    
    //@Length(5,255, { groups:['create'] })    se indica que para create se permite 5 a 255
    //@Length(10,20, { groups:['update'] })    se indica que para update permite de 10 a 20
    @Length(5,255)        
    address: string;
}