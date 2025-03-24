import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create.dto";


export class DeleteDto extends PickType(CreateUserDto, ['password']) {}