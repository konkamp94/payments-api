import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedDatabase } from './seed-db';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // seed database with demo data
  await seedDatabase(app.get(DataSource), app.get(ConfigService));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(3000);
}
bootstrap();
