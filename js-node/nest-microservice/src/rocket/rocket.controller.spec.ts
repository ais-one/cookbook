import { Test, TestingModule } from '@nestjs/testing';
import { RocketController } from './rocket.controller';

describe('RocketController', () => {
  let controller: RocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RocketController],
    }).compile();

    controller = module.get<RocketController>(RocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
