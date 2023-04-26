import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Post()
  @HttpCode(200)
  public postNewData(@Req() request: Request) {
    console.log('WebHoolController.postNewData()', request);
    return { status: 'OK' };
  }
}
