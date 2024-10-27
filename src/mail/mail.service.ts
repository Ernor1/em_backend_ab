import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendEmail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }
  async sendEmployeeWelcomeEmail(to: string, firstName: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to our company!',
      text: `Hello ${firstName}, welcome to our company!`,
    });
  }
  async sendEmployeeAttendanceEmail(to: string, firstName: string, text: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Attendance Recorded',
      text: text,
    });
  }
}
