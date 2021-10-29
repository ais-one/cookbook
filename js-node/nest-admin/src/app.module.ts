import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
// import { AbstractService } from './abstract/abstract.service'; // REMOVED because it will not be used anywhere
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission/permission.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: 'db.sqlite',
      // entities: [],
      autoLoadEntities: true, // do not use on production
      synchronize: true, // do not use on production
    }),
    UserModule,
    AuthModule,
    CommonModule,
    RoleModule,
    PermissionModule,
    ProductModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { // apply guard globally
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
    // AbstractService // REMOVED because it will not be used anywhere
  ],
})
export class AppModule {}
