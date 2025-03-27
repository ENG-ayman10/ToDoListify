import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as cookiesParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(cookiesParser());
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>("TODOLISTIFY_FRONTEND_URL", "http://localhost:8080/"),
    credentials: true
  });
  const PORT: number = Number.parseInt(configService.get<string>("TODOLISTIFY_PORT"))
  const logger: Logger = new Logger('bootstrap', {timestamp: true});
  logger.log(`App running on ${PORT}`);
  await app.listen(PORT);
}
bootstrap();
