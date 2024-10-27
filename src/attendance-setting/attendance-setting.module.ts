import { Module } from '@nestjs/common';
import { AttendanceSettingService } from './attendance-setting.service';
import { AttendanceSettingController } from './attendance-setting.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [AttendanceSettingController],
  providers: [AttendanceSettingService, JwtService, UsersService],
})
export class AttendanceSettingModule { }
