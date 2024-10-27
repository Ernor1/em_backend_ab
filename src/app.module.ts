import { Module, OnModuleInit } from '@nestjs/common'
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
import { OpenAiModule } from './openai/openai.module';
import { RolesService } from './roles/roles.service';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';
import { AttendanceSettingModule } from './attendance-setting/attendance-setting.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, AuthModule, RolesModule, OpenAiModule, EmployeeModule, DepartmentModule, AttendanceSettingModule, AttendanceModule,
  MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS
      auth: {
        user: 'honoreerukundo@gmail.com', // your Gmail email
        pass: 'mqzk lukr jmwp ioii', // your Gmail app password
      },
    },
    defaults: {
      from: '"No Reply" honoreerukundo@gmail.com', // default sender address
    },
  }),
  ],
  controllers: [AppController],
  providers: [AppService, RolesService, {
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
export class AppModule implements OnModuleInit {
  constructor(
    private readonly roleService: RolesService,
  ) { }

  seedData = true



  async onModuleInit() {
    if (this.seedData) {
      // data seeding before the application begins 
      this.roleService.initiateRoles()
    }
  }
}
