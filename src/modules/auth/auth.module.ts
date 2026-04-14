import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';

import { ConfigModule } from '@/config/config.module'; 
import { ConfigService } from '@/config/config.service'; 

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterService } from './services/register.service';
import { VerifyEmailService } from './services/register-verify.service';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { StringValue } from 'ms';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MailModule,
    PassportModule,
    RedisModule,
    UserModule,
    ConfigModule, // 🔥 GLOBAL bo‘lsa ham qo‘shish yaxshi

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.jwt.accessSecret, 
        signOptions: {
          expiresIn: config.jwt.accessExpiresIn as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterService,
    VerifyEmailService,
    LoginService,
    LogoutService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}