import { Test, TestingModule } from '@nestjs/testing';
import { AbstractService } from './abstract.service';

describe('AbstractService', () => {
  let service: AbstractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbstractService],
    }).compile();

    service = module.get<AbstractService>(AbstractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
