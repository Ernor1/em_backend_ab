import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttendanceSettingService } from './attendance-setting.service';
import { CreateAttendanceSettingDto } from './dto/create-attendance-setting.dto';
import { UpdateAttendanceSettingDto } from './dto/update-attendance-setting.dto';
import { ApiResponse } from 'src/responses/api.response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
@ApiTags('Attendance Setting')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('attendance-setting')
export class AttendanceSettingController {
  constructor(private readonly attendanceSettingService: AttendanceSettingService) { }

  @Post()
  async create(@Body() createAttendanceSettingDto: CreateAttendanceSettingDto) {
    try {
      return new ApiResponse(true, 'Attendance setting created successfully', await this.attendanceSettingService.create(createAttendanceSettingDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Get()
  async findAll() {
    try {
      return new ApiResponse(true, 'Attendance setting retrieved successfully', await this.attendanceSettingService.findAll());
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Attendance setting retrieved successfully', await this.attendanceSettingService.findOne(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAttendanceSettingDto: UpdateAttendanceSettingDto) {
    try {
      return new ApiResponse(true, 'Attendance setting updated successfully', await this.attendanceSettingService.update(id, updateAttendanceSettingDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Attendance setting deleted successfully', await this.attendanceSettingService.remove(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }
}
