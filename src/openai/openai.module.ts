import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenAiService } from './openai.service';
import { OpenaiController } from './openai.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,   // Optional: set request timeout
      maxRedirects: 5, // Optional: handle redirects
    }),
  ],
  providers: [OpenAiService],
  exports: [OpenAiService],
  controllers: [OpenaiController]
})
export class OpenAiModule { }
