import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DatabaseService } from 'src/database/database.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly databaseService: DatabaseService, private readonly mailService: MailService) {

  }
  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      let user = await this.databaseService.user.create({
        data: {
          email: createEmployeeDto.email,
          firstName: createEmployeeDto.firstName,
          lastName: createEmployeeDto.lastName,
        }
      });
      let res = await this.databaseService.employee.create({
        data: {
          user: {
            connect: {
              id: user.id
            }
          },
          department: {
            connect: {
              id: createEmployeeDto.departmentId
            }
          },
          position: createEmployeeDto.position,
          joiningDate: new Date(createEmployeeDto.joiningDate),

        }
      });
      await this.mailService.sendEmployeeWelcomeEmail(createEmployeeDto.email, createEmployeeDto.firstName);
      return res;



    }
    catch (e) {
      throw e;
    }
  }
  async findAll() {
    try {
      return await this.databaseService.employee.findMany();
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      return await this.databaseService.employee.findUnique({
        where: { id }
      });
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      return await this.databaseService.employee.update({
        where: { id },
        data: updateEmployeeDto
      });
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.databaseService.employee.delete({
        where: { id }
      });
    } catch (e) {
      throw e;
    }

  }
}
