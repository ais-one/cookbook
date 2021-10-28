import { Module  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RocketService } from './rocket/rocket.service';
import { RocketController } from './rocket/rocket.controller';
import { RocketModule } from './rocket/rocket.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [RocketModule, HttpModule],
  controllers: [AppController, RocketController],
  providers: [AppService, RocketService],
})
export class AppModule {}
