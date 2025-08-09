import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Farseit API')
    .setDescription('API documentation for Farseit backend')
    .setVersion('1.0')
    .addBearerAuth() // Optional: if using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Accessible at /api

  // Console Logging Environment Variables
  console.log('------------------------------------------------------------');
  console.log('PG Database');
  console.log('------------------------------------------------------------');
  console.log(`Host: ${process.env.DATABASE_HOST}`);
  console.log(`Port: ${process.env.DATABASE_PORT}`);
  console.log(`User: ${process.env.DATABASE_USER}`);
  console.log(`Password: ${process.env.DATABASE_PASSWORD}`);
  console.log(`Database: ${process.env.DATABASE_NAME}`);
  console.log('------------------------------------------------------------');
  console.log('Email');
  console.log('------------------------------------------------------------');
  console.log(`Host: ${process.env.EMAIL_HOST}`);
  console.log(`From: ${process.env.EMAIL_FROM}`);
  console.log(`User: ${process.env.EMAIL_USER}`);
  console.log(`Pass: ${process.env.EMAIL_PASS}`);
  console.log(`Port: ${process.env.EMAIL_PORT}`);
  console.log('------------------------------------------------------------');

  await app.listen(7000);
}
bootstrap();
