import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity, UserEntity]),
        AuthModule
    ],
    providers: [JwtStrategy, TaskService],
    controllers: [TaskController]
})
export class TaskModule {}
