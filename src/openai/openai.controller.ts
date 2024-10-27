import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';
import { OpenAiService } from './openai.service';
import { Allow } from 'src/decorators/allow.decorator';

@Controller('openai')
@Allow()
export class OpenaiController {
  constructor(private readonly openaiService: OpenAiService) { }

  @Post('/prompt')
  create(@Body() createOpenaiDto: CreateOpenaiDto) {
    console.log(createOpenaiDto);
    return this.openaiService.generateText(createOpenaiDto.prompt);
  }

}
