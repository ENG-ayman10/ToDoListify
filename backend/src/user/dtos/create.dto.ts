import { 
    IsEmail,
    IsLowercase,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";
import { IsPasswordMatch } from "../validators/password-conf.validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(255)
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    @MinLength(5)
    @MaxLength(50)
    @Matches(
        /([a-z0-9_]+)/,
        { message: "Invalid username please use lowercase letters and/or numbers and/or underscore!" }
    )
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(512)
    @Matches(
        /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: "Password too weak, please use uppercase and lowercase letters and symbols and numbers!" }
    )
    password: string;

    @IsPasswordMatch('password', {message: "Invalid password confirmation!"})
    confirmation: string;
}