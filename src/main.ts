import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * from 'fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastify),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
