import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role_Enum } from 'src/enums/role.enum';
import { ApiResponse } from 'src/responses/api.response';
import { UpdateUserDto } from './dto/update-user.dto';
import { Allow } from 'src/decorators/allow.decorator';

@Controller('users')
@UseGuards(AuthGuard)
// @Roles(Role_Enum.ADMIN)
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Allow()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return new ApiResponse(true, "User Created Successfully", await this.usersService.create(createUserDto));
    } catch (e) {
      return new ApiResponse(false, e.message, null);
    }
  }

  @Get()
  async findAll() {
    return new ApiResponse(true, "All Users", await this.usersService.findAll());
  }

  @Get(':id')
  @ApiParam({ name: "id", type: String })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return new ApiResponse(true, "User Retrieved", await this.usersService.findOne(id));
  }

  @Patch(':id')
  @ApiParam({ name: "id", type: String })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return new ApiResponse(true, "Updated User", this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiParam({ name: "id", type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return new ApiResponse(true, "Deleted User", this.usersService.remove(id));
  }
}
