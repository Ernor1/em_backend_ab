import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { OpenAiService } from 'src/openai/openai.service';
import { MailerService } from '@nestjs-modules/mailer';
import { DatabaseService } from 'src/database/database.service';
import { HttpModule } from '@nestjs/axios';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          timeout: 5000,   // Optional: set request timeout
          maxRedirects: 5, // Optional: handle redirects
        }),
      ],
      providers: [AttendanceService, DatabaseService, JwtService, UsersService, MailService, OpenAiService, {
        provide: MailerService,
        useValue: {
          // Mock any methods of MailerService if needed
          sendMail: jest.fn().mockResolvedValue(true), // Example mock for sendMail
        },
      },],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
