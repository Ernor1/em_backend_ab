import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateAttendanceDto {
    @ApiProperty()
    @IsOptional()
    employeeEmail: string;
    @ApiProperty({
        type: String,
        example: 'HH:mm'
    })
    @IsOptional()
    checkIn?: string
    @ApiProperty({
        type: String,
        example: 'HH:mm'
    })
    @IsOptional()
    checkOut?: string
    @ApiProperty({
        type: Boolean,
        example: true
    })
    @IsOptional()
    workFromHome?: boolean

}

