import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches, IsOptional, IsArray, ValidateNested } from "class-validator";


export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    firstName: string
    @IsNotEmpty()
    @ApiProperty()
    lastName: string
    @ApiProperty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(16)
    @ApiProperty()
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
        message: 'Password must have at least 6 characters, one symbol, one number, and one uppercase letter.',
    })
    password: string
    @ApiProperty()
    status?: Status
    @ApiProperty()
    @IsArray()
    roles: string[]
    @ApiProperty({
        description: 'This is the admin key that will be used to create an admin user. This is optional'
    })
    @IsOptional()
    @IsString()
    adminKey?: string


}
