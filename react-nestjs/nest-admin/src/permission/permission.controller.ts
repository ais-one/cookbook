/* NOSONAR
1, view_users
2, edit_users
3, view_roles
4, edit_roles
5, view_products
6, edit_products
7, view_orders
8, edit_orders
*/
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionService } from './permission.service';

@UseGuards(AuthGuard)
@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) { }
  @Get()
  async all() {
    return this.permissionService.all()
  }
}
