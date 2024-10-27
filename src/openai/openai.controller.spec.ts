import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiController } from './openai.controller';
import { OpenAiService } from './openai.service';
import { HttpModule, HttpService } from '@nestjs/axios';

describe('OpenaiController', () => {
  let controller: OpenaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          timeout: 5000,   // Optional: set request timeout
          maxRedirects: 5, // Optional: handle redirects
        }),
      ],
      controllers: [OpenaiController],
      providers: [OpenAiService],
    }).compile();

    controller = module.get<OpenaiController>(OpenaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
