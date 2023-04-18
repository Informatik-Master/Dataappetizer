import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { PollerService } from './pollerservice/poller.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000);
  // let pollerService = new PollerService();
  // pollerService.pollFromCarusoAPI();
}
bootstrap();
