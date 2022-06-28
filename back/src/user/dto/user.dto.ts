import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class userDto {

    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @IsNotEmpty()
    @MinLength(2)
    username: string;

    @IsNotEmpty() 
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    enable2FA: boolean;

    status: string;

    authenticate: boolean;

    isFirst: boolean;

    rank: string;

    // friends: number[];

    id?: number;
	static id: number;
}

