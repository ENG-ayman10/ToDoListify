import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create.dto";


export class UpdatePasswordDto extends PickType(CreateUserDto, ['confirmation', 'password']) {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(512)
    @Matches(
        /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: "Invalid old password!" }
    )
    oldPassword: string;
}