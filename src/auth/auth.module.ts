import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import {JwtModule} from '@nestjs/jwt';
import { JwtStartegy } from './strategy';


@Module({
  imports:[PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService,JwtStartegy]
})
export class AuthModule {}
