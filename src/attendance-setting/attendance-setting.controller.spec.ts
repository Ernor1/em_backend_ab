import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceSettingController } from './attendance-setting.controller';
import { AttendanceSettingService } from './attendance-setting.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

describe('AttendanceSettingController', () => {
  let controller: AttendanceSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceSettingController],
      providers: [AttendanceSettingService, DatabaseService, JwtService, UsersService],
    }).compile();

    controller = module.get<AttendanceSettingController>(AttendanceSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
