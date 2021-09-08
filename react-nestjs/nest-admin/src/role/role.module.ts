import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
  ],  
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService] // prevent circular dependency - so it can be used elsewhere
})
export class RoleModule {}
