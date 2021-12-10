import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./input/create.user.dto";
import { User } from "./user.entity";

@Controller('users')
export class UsersController{

    constructor(
        private readonly authServices:AuthService,
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    @Post('create')
    async create(@Body() createUserDto:CreateUserDto){
        const user= new User();

        if(createUserDto.password!==createUserDto.retypedPassword){
            throw new BadRequestException(['Passwords are not identical']);
        }
        const existingUser = await this.userRepository.findOne({
            where:[
                { username : createUserDto.username },
                { email: createUserDto.email}
            ]
        });

        if(existingUser){
            throw new BadRequestException(['username or email is already taken']);
        }
        
        user.username = createUserDto.username;
        user.password = await this.authServices.hashPassword(createUserDto.password);
        user.email = createUserDto.email;
        user.firstName =createUserDto.firstName;
        user.lastName = createUserDto.lastName;

        await this.userRepository.save(user)
        user.password=""
        
        return {
            ...(user),
            token:this.authServices.getTokenForUser(user)
        } 
    }
}