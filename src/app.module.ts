import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';
import { AppExceptionFilter } from './filter/exception.filter';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, AuthModule, RolesModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }, {
      provide: APP_GUARD,
      useClass: RolesGuard
    }, {
      provide: APP_FILTER,
      useClass: AppExceptionFilter
    }],
})
export class AppModule { }
