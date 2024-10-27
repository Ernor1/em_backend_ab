import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceSettingService } from './attendance-setting.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

describe('AttendanceSettingService', () => {
  let service: AttendanceSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceSettingService, DatabaseService, JwtService, UsersService],
    }).compile();

    service = module.get<AttendanceSettingService>(AttendanceSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
