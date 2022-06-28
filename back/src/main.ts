import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'colyseus'
import PongRoom from './game/pongroom';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const gameServer = new Server();

  gameServer.define('pong', PongRoom);
  gameServer.attach({ server: app.getHttpServer() });
  app.enableCors({
    origin: ['http://localhost:3000', '*'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
    )
  await app.listen(4000);
}

bootstrap();