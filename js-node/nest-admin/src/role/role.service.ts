import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/abstract/abstract.service';
import { Repository } from 'typeorm';
import { Role } from './models/role.entity';

@Injectable()
export class RoleService extends AbstractService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {
    super(roleRepository)
  }
}
