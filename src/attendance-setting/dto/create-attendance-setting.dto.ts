import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAttendanceSettingDto {
    @ApiProperty({
        type: String,
        example: 'HH:mm'
    })
    @IsString()
    startTime: string;
    @ApiProperty({
        type: String,
        example: 'HH:mm'
    })
    @IsString()
    endTime: string;
}
