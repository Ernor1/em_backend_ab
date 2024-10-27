import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtService, UsersService, MailService],
})
export class EmployeeModule { }
