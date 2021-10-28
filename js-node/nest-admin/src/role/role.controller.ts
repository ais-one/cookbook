import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HasPermission } from 'src/permission/has-permission.decorator';
import { Role } from './models/role.entity';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) { }

  @Get()
  @HasPermission('roles')
  async all() {
    return this.roleService.all()
  }

  @Post()
  @HasPermission('roles')
  async create(
    @Body('name') name: string,
    @Body('permission') permissionIds: number[]
  ): Promise<Role> {
    return this.roleService.create({
      name,
      permission: permissionIds.map(id => ({id}))
    })
  }

  @Get(':id')
  @HasPermission('roles')
  async get(@Param('id') id: number) {
    return this.roleService.findOne({id}, ['permission'])
  }

  @Put(':id')
  @HasPermission('roles')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('permission') permissionIds: number[]
  ) {
    await this.roleService.update(id, { name })
    const role = await this.roleService.findOne({id})

    return this.roleService.create({
      ...role,
      permission: permissionIds.map(id => ({id}))
    })
  }

  @Delete(':id')
  @HasPermission('roles')
  async delete(@Param('id') id: number) {
    return this.roleService.delete(id)
  }
}
