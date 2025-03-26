import { 
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";
import { TaskState } from "../enums/state.enum";
import { TaskPriority } from "../enums/priority.enum";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(1)
    title: string;
    
    @IsString()
    body: string;

    @IsOptional()
    @IsEnum(TaskState)
    state?: TaskState;
    
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;
}