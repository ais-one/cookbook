import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Res, Req, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor, AuthInterceptor) // to let @Exclude work
  // you can user here for all in this controller, or inside the controller for each route 
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService
  ) {
  }

  @Post('register')
  @ApiCreatedResponse()
  async register(@Body() body :RegisterDto) {
    if (body.password !== body.password_confirm) throw new BadRequestException('Password Does Not Match')
    body.password = await bcrypt.hash(body.password, 12);
    return this.userService.create({
      ...body,
      role: { id: 2 } // default to customer role
    }); // body;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({passthrough: true}) response: Response
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new NotFoundException('User Not Found');
    if (!await bcrypt.compare(password, user.password)) throw new BadRequestException('Invalid Credentials')

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true, sameSite: 'lax' });
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async user(@Req() request: Request) {
    const id = await this.authService.userId(request)
    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Res({passthrough: true}) response: Response
  ) {
    response.clearCookie('jwt');
    return {
      message: 'logged out'
    }
  }
}
