import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DatabaseService } from 'src/database/database.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesService {
  constructor(private readonly dataBaseService: DatabaseService, private readonly userService: UsersService) {

  }
  async create(createRoleDto: CreateRoleDto) {
    return this.dataBaseService.role.create({
      data: {
        name: createRoleDto.name
      }
    })
  }

  async findAll() {
    return this.dataBaseService.role.findMany({})
  }

  async findOne(id: string) {
    return this.dataBaseService.role.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.dataBaseService.role.update({
      where: { id },
      data: {
        name: updateRoleDto.name
      }
    })
  }

  async remove(id: string) {
    return this.dataBaseService.role.delete({
      where: { id }
    })
  }
  async assignRoles(assignRole: AssignRoleDto) {
    const { roleId, userIds } = assignRole;

    try {
      await this.dataBaseService.$transaction(async () => {
        for (const userId of userIds) {
          try {
            const user = await this.userService.findOne(userId)
            if (user) {
              if (!user.roles.some(role => role.id === roleId)) {
                await this.dataBaseService.user.update({
                  where: { id: userId },
                  data: {
                    roles: {
                      connect: { id: roleId }
                    }
                  }
                });
              }
            } else {
              throw new NotFoundException(`User with id ${userId} not found.`);
            }

          } catch (error) {
            if (error instanceof NotFoundException) {
              throw new NotFoundException(error.message);
            }
            throw error

          }

        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }


}
