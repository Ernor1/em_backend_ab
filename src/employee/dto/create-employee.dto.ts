import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class CreateEmployeeDto {
    @IsNotEmpty()
    @ApiProperty()
    firstName: string
    @IsNotEmpty()
    @ApiProperty()
    lastName: string
    @ApiProperty()
    @IsEmail()
    email: string
    @ApiProperty({
        type: String,
        example: 'YYYY-MM-DD'
    })
    @IsNotEmpty()
    joiningDate: string
    @ApiProperty()
    @IsNotEmpty()
    departmentId: string
    @ApiProperty()
    @IsNotEmpty()
    position: string


}
