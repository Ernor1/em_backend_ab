import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, Reflector],
  exports: [UsersService]
})
export class UsersModule { }
