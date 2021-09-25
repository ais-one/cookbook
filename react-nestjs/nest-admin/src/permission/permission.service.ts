import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/abstract/abstract.service';
import { Repository } from 'typeorm';
import { Permission } from './model/permission.entity';

@Injectable()
export class PermissionService extends AbstractService {
  constructor(@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>) { 
    super(permissionRepository)
  }
  // async all(): Promise<Permission[]> {
  //   return this.permissionRepository.find();
  // }
}
