import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";


@Injectable()
export class AuthService{

    constructor(
        private readonly jwtServices:JwtService,
    ){}


    public getTokenForUser(user:User): string{
        return this.jwtServices.sign({
            username: user.username,
            sub: user.id
        })
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
      }
}