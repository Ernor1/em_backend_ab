import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiService } from './openai.service';
import { HttpModule, HttpService } from '@nestjs/axios';

describe('OpenAiService', () => {
  let service: OpenAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          timeout: 5000,   // Optional: set request timeout
          maxRedirects: 5, // Optional: handle redirects
        }),
      ],
      providers: [OpenAiService],
    }).compile();

    service = module.get<OpenAiService>(OpenAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
