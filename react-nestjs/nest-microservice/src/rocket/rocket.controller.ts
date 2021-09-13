import { Controller, Get } from '@nestjs/common';
import { RocketService } from './rocket.service';

@Controller('rocket')
export class RocketController {
  constructor(private rocketService: RocketService) {}

  @Get()
  getNextLaunchRemainingTime() {
    return this.rocketService.getNextLaunchRemainingTime()
  }
}
