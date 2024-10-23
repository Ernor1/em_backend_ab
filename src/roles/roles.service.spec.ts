import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { DatabaseService } from 'src/database/database.service';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, DatabaseService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
