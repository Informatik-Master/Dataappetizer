import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { HttpModule } from '@nestjs/axios';
import { WebhookController } from './WebHook.controller';

@Module({
  imports: [HttpModule],
  controllers: [ApiController, WebhookController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
