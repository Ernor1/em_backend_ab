import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class checkOutAttendanceDto {
    @ApiProperty()
    @IsOptional()
    employeeEmail: string;
    @ApiProperty({
        type: String,
        example: 'HH:mm'
    })
    @IsOptional()
    checkOut?: string


}

