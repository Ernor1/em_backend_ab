import { Injectable } from '@nestjs/common';
import { CreateAttendanceSettingDto } from './dto/create-attendance-setting.dto';
import { UpdateAttendanceSettingDto } from './dto/update-attendance-setting.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AttendanceSettingService {
  constructor(private readonly dataBaseService: DatabaseService) { }
  async create(createAttendanceSettingDto: CreateAttendanceSettingDto) {
    try {
      return await this.dataBaseService.attendanceSetting.create({
        data: createAttendanceSettingDto
      });
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    try {
      return await this.dataBaseService.attendanceSetting.findMany();
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      return await this.dataBaseService.attendanceSetting.findUnique({
        where: { id }
      });
    } catch (e) {
      throw e;
    }

  }

  async update(id: string, updateAttendanceSettingDto: UpdateAttendanceSettingDto) {

    try {
      return await this.dataBaseService.attendanceSetting.update({
        where: { id },
        data: updateAttendanceSettingDto
      });
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.dataBaseService.attendanceSetting.delete({
        where: { id }
      });
    } catch (e) {
      throw e;
    }
  }
}
