import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';
import * as express from 'express';
import { join } from 'path';
import { PORT } from './settings';
import { JSONParseExceptionFilter } from './api/common/json-parse-exception.filter';

async function bootstrap() {
  console.log('api mode');

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MyJob API')
    .setDescription('MyJob API')
    .setVersion('0.0.1')
    .addTag('MyJob API')
    .build();

  const swagger = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, swagger);

  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(json({ limit: '64mb' }));

  app.use(
    '/.well-known/acme-challenge',
    express.static(
      join(__dirname, '..', 'public', '.well-known', 'acme-challenge'),
    ),
  );

  app.useGlobalFilters(new JSONParseExceptionFilter());

  await app.listen(PORT ?? 3000);
  return;
}
bootstrap();
