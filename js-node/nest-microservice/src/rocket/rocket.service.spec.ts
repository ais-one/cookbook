import { Test, TestingModule } from '@nestjs/testing';
import { RocketService } from './rocket.service';

describe('RocketService', () => {
  let service: RocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RocketService],
    }).compile();

    service = module.get<RocketService>(RocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
