import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly dataBaseService: DatabaseService) { }
  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.dataBaseService.department.create({
        data: createDepartmentDto
      });
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    try {
      return await this.dataBaseService.department.findMany();
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      return await this.dataBaseService.department.findUnique({
        where: { id }
      });
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      return await this.dataBaseService.department.update({
        where: { id },
        data: updateDepartmentDto
      });
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.dataBaseService.department.delete({
        where: { id }
      });
    } catch (e) {
      throw e;
    }
  }
}
