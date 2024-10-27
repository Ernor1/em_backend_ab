import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceSettingDto } from './create-attendance-setting.dto';

export class UpdateAttendanceSettingDto extends PartialType(CreateAttendanceSettingDto) {}
