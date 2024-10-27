import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { DatabaseService } from 'src/database/database.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeService, JwtService, UsersService, MailService, DatabaseService, {
        provide: MailerService,
        useValue: {
          // Mock any methods of MailerService if needed
          sendMail: jest.fn().mockResolvedValue(true), // Example mock for sendMail
        },
      },],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
