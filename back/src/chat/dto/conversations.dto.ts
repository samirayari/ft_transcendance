import { IsNotEmpty, MinLength } from "class-validator";
import { Messages } from "../entities/messages.entity";
import { Participants } from "../entities/participants.entity";


export class conversationsDto {

    @IsNotEmpty()
    @MinLength(2)
    name:string;

    @IsNotEmpty()
    userid:number;

    visibility:boolean;
    
    messagetype:string;

    status:string;

    participants?:Participants[]

    messages?:Messages[]
    
    password?:string;
}
