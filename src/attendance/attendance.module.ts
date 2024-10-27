import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { OpenAiService } from 'src/openai/openai.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,   // Optional: set request timeout
      maxRedirects: 5, // Optional: handle redirects
    }),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, JwtService, UsersService, MailService, OpenAiService],
})
export class AttendanceModule { }
