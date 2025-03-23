import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule,
        ConfigModule
    ],
    providers: [JwtStrategy, UserService],
    controllers: [UserController]
})
export class UserModule {}
