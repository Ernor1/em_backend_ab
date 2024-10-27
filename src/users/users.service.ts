import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true }
}>

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {

  }
  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

      // Fetch the roles from the database using the provided role IDs
      const roles = await this.databaseService.role.findMany({
        where: {
          id: { in: createUserDto.roles },
        },
      });

      // Check if any of the roles have the name "ADMIN"
      const hasAdminRole = roles.some(role => role.name === 'ADMIN');

      // If an ADMIN role is found, ask for or validate the admin key
      if (hasAdminRole) {
        if (!createUserDto.adminKey || createUserDto.adminKey !== process.env.ADMIN_KEY) {
          throw new Error('Invalid admin key. Cannot assign ADMIN role.');
        }
      }

      // Filter roles, removing "ADMIN" if no valid admin key is provided
      const rolesToAssign = roles.filter(role => {
        if (role.name === 'ADMIN') {
          return createUserDto.adminKey && createUserDto.adminKey === process.env.ADMIN_KEY;
        }
        return true;
      });

      // Create the user with the valid roles
      let user = await this.databaseService.user.create({
        data: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
          status: createUserDto.status,
          roles: {
            connect: rolesToAssign.map(role => ({ id: role.id }))
          }
        },
        include: { roles: true }
      },);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
        roles: user.roles
      }
    } catch (e) {
      throw e;
    }

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

  async update(id: string, updateUserDto: UpdateUserDto) {
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
