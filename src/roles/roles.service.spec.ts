import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, DatabaseService, JwtService, UsersService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
