import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { PollerService } from './pollerservice/poller.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000);
  const pollerService = app.get(PollerService);
  pollerService.saveCars();
  pollerService.pollFromCarusoAPI();
}
bootstrap();
