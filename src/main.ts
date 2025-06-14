import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
 // console.log("Fahim")
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  Logger.log('------------------------------------------------------------');

    Logger.log('------------------------------------------------------------');
    Logger.log(`PG Database`);
    Logger.log('------------------------------------------------------------');
    Logger.log(`Host: ${process.env.DATABASE_HOST}`);
    Logger.log(`Port: ${process.env.DATABASE_PORT}`);
    Logger.log(`User: ${process.env.DATABASE_USER}`);
    Logger.log(`Database: ${process.env.DATABASE_NAME}`);
        Logger.log(`User: ${process.env.DATABASE_PASSWORD}`);

    Logger.log('------------------------------------------------------------');
      Logger.log('------------------------------------------------------------');

    Logger.log('------------------------------------------------------------');
    Logger.log(`Email`);
    Logger.log('------------------------------------------------------------');
    Logger.log(`Host: ${process.env.EMAIL_HOST}`);
    Logger.log(`Port: ${process.env.EMAIL_FROM}`);
    Logger.log(`User: ${process.env.EMAIL_USER}`);
    Logger.log(`Database: ${process.env.EMAIL_PASS}`);
        Logger.log(`User: ${process.env.EMAIL_PORT}`);

    Logger.log('------------------------------------------------------------');
  await app.listen(7000);
}
bootstrap();
