import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { envConfig } from './config/env.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { rateLimitConfig } from './config/rate-limit.config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(typeormConfig),
    AuthModule,
    UserModule,
    TaskModule,
    ThrottlerModule.forRoot(rateLimitConfig)
  ],
  controllers: [],
  providers: [
    {provide: APP_GUARD, useClass: ThrottlerGuard}
  ],
})
export class AppModule {}
