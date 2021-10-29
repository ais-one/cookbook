import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './models/user.entity';
import { UserService } from './user.service';

import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule,
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] // prevent circular dependency - so it can be used elsewhere
})
export class UserModule {}
