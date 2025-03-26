import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateTaskDto } from './dtos/create.dto';
import { omitObjectKeys } from 'src/utils/omit.util';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>
    ) {}

    async create( createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
        const task: TaskEntity = this.taskRepository.create();
        Object.assign(task, createTaskDto);
        task.user = user;
        return omitObjectKeys( await task.save(), ['user']) as TaskEntity;
    }

    async getAll( user: UserEntity ): Promise<TaskEntity[]> {
        const tasks: TaskEntity[] = await this.taskRepository.find({where: { userId: user.id }});
        if (tasks.length < 1) throw new NotFoundException("No tasks found!"); 
        return tasks;
    }
}
