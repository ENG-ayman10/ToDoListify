import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateTaskDto } from './dtos/create.dto';
import { omitObjectKeys } from 'src/utils/omit.util';
import { UpdateTaskDto } from './dtos/update.dto';

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

    async update(id: number, updateTaskDto: UpdateTaskDto, user: UserEntity): Promise<TaskEntity> {
        const updatefields: string[] = [
            'title',
            'body',
            'state',
            'priority'
        ]
        const updateTaskDtoKeys: string[] = Object.keys(updateTaskDto);
        if (
            updateTaskDtoKeys.length > updatefields.length ||
            updateTaskDtoKeys.length < 1 ||
            !updateTaskDtoKeys.every( (key) => updatefields.includes(key) )
        ) throw new BadRequestException("Invalid body!");
        const task = await this.taskRepository.findOne({where: {id, userId: user.id}});
        if (!task) throw new NotFoundException(`Task with ID '${id}' NOT found!`);
        Object.assign(task, updateTaskDto);
        return omitObjectKeys(await task.save(), ['user']) as TaskEntity;
    }

    async delete(id: number, user: UserEntity): Promise<void> {
        const {affected} = await this.taskRepository.delete({id, userId: user.id});
        if (affected < 1 ) throw new NotFoundException(`Task with ID '${id}' NOT found!`);
        return;
    }
}
