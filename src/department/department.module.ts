import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, JwtService, UsersService],
})
export class DepartmentModule { }
