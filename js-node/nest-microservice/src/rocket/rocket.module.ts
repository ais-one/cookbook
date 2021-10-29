import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RocketService } from './rocket.service';

@Module({
  imports: [HttpModule],
  providers: [RocketService],
})
export class RocketModule {}
