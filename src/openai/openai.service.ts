import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenAiService {
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

  constructor(private readonly httpService: HttpService) { }

  async generateText(prompt: string): Promise<string> {
    try {


      const data = {
        contents: [
          {
            parts: [
              {
                text: prompt

              }
            ]

          }

        ]

      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}`, data)
      );
      console.log(response.data.candidates[0].content.parts[0].text);

      return response.data.candidates[0].content.parts[0].text.trim();
    } catch (err) {
      throw err
    }

  }
}
