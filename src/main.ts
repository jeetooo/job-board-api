import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add this — allows Next.js on port 3001 to call NestJS on port 3000
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // This one line enables validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,    
    forbidNonWhitelisted: true, // throws error if extra fields sent
    transform: true   // auto-converts types (string "123" → number 123)
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
