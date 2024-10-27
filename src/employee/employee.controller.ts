import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiResponse } from 'src/responses/api.response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      return new ApiResponse(true, 'Employee created successfully', await this.employeeService.create(createEmployeeDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null)
    }
  }

  @Get()
  async findAll() {
    try {
      return new ApiResponse(true, 'Employee retrieved successfully', await this.employeeService.findAll());
    } catch (e) {
      return new ApiResponse(false, e.message, null)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Employee retrieved successfully', await this.employeeService.findOne(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null)
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    try {
      return new ApiResponse(true, 'Employee updated successfully', await this.employeeService.update(id, updateEmployeeDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Employee deleted successfully', await this.employeeService.remove(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null)
    }
  }
}
