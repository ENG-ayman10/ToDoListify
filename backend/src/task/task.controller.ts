import { 
    Controller, 
    Delete, 
    Get, 
    Logger, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { TaskService } from './task.service';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {

    private readonly logger: Logger = new Logger(TaskController.name, {timestamp: true});
    private readonly API_PATH: string = "/api/v1/task";

    constructor(
        private taskService: TaskService
    ) {}

    @Get()
    getAll(
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`GET '${this.API_PATH}'`);
        return;
    }
    
    @Post('create')
    create(
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`POST '${this.API_PATH}/create'`);
        return;
    }

    @Patch('update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`PATCH '${this.API_PATH}/update/${id}'`);
        return;
    }

    @Delete('delete/:id')
    delete(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`DELETE '${this.API_PATH}/delete/${id}'`);
        return;
    }
}
