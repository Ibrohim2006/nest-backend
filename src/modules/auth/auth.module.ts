import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from '../user/entities/user.entity';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterService } from './services/register.service';
import { VerifyEmailService } from './services/register-verify.service';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MailModule,
    PassportModule,
    RedisModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('APP_JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('APP_JWT_EXPIRES_IN') as any,
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
