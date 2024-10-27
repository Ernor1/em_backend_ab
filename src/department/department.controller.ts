import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiResponse } from 'src/responses/api.response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
@ApiTags('Department')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      return new ApiResponse(true, 'Department created successfully', await this.departmentService.create(createDepartmentDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Get()
  async findAll() {
    try {
      return new ApiResponse(true, 'Department retrieved successfully', await this.departmentService.findAll());
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Department retrieved successfully', await this.departmentService.findOne(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    try {
      return new ApiResponse(true, 'Department updated successfully', await this.departmentService.update(id, updateDepartmentDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new ApiResponse(true, 'Department deleted successfully', await this.departmentService.remove(id));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }
}
