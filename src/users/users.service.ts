import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true }
}>

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {

  }
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
    return await this.databaseService.user.create({
      data: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: createUserDto.password,
        status: createUserDto.status
      }
    });
  }

  async findAll() {
    return this.databaseService.user.findMany({
      include: { roles: true }
    });
  }

  async findOne(id: string) {
    return await this.databaseService.user.findUnique({
      where: {
        id,
      },
      include: { roles: true }
    });
  }
  async findUserByEmail(email: string): Promise<UserWithRoles> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      data: {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        email: updateUserDto.email,
        password: updateUserDto.email

      },
      where: { id }
    });
  }

  async remove(id: string) {
    return this.databaseService.user.delete({
      where: { id }
    });
  }
}
