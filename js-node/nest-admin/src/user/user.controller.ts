import { Controller, Get, Post, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards, Param, Put, Delete, Query, Req, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PaginatedResult } from 'src/abstract/paginated-result';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';

@ApiTags('user')
@UseInterceptors(ClassSerializerInterceptor) // to let @Exclude work
@UseGuards(AuthGuard) // only auth users can access
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
  }

  @Get()
  @HasPermission('users')
  all(@Query('page') page: number = 1): Promise<PaginatedResult> {
    return this.userService.paginate(page, ['role']);
  }

  @Post()
  @HasPermission('users')
  async create(@Body() body: UserCreateDto): Promise<User> {
    const password = await bcrypt.hash('test', 12);
    // NOSONAR return this.userService.create({ ...body, password });

    const { role_id, ...data } = body

    return this.userService.create({ 
      ...data,
      password,
      role: { id: body.role_id }
    })
  }

  // need to put this here, order is important
  @Put('info')
  async updateInfo(
    @Body() body: UserUpdateDto,
    @Req() request: Request
  ) {
    const id = await this.authService.userId(request)
    await this.userService.update(id, body) // no role update
    return this.userService.findOne({id})
  }

  @Put('password')
  async updatePassword(
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
    @Req() request: Request
  ) {
    if (password !== password_confirm) throw new BadRequestException('Password Does Not Match')
    const id = await this.authService.userId(request)
    const hashed = await bcrypt.hash(password, 12)
    await this.userService.update(id, { password: hashed }) // no role update
    return this.userService.findOne({id})
  }


  @Get(':id')
  @HasPermission('users')
  async get(@Param('id') id: number) {
    return this.userService.findOne({id}, ['role'])
  }

  @Put(':id')
  @HasPermission('users')
  async update(@Param('id') id: number, @Body() body: UserUpdateDto) {
    const { role_id, ...data } = body
    await this.userService.update(id, {
      ...data,
      // role: { id: role_id }
    })
    return this.userService.findOne({id})
  }

  @Delete(':id')
  @HasPermission('users')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id)
  }
}
