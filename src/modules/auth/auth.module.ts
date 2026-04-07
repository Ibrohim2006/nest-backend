import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from '../users/entities/user.entity';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterService } from './services/register.service';
import { VerifyEmailService } from './services/verify-email.service';
import { ResendVerificationService } from './services/resend-verification.service';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { VerifyForgotPasswordService } from './services/verify-forgot-password.service';
import { ResetPasswordService } from './services/reset-password.service';
import { ChangePasswordService } from './services/change-password.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { JwtStrategy } from '../common/utils/jwt.strategy';
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
        secret: config.getOrThrow<string>('app.jwtSecret'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('app.jwtExpiresIn') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterService,
    VerifyEmailService,
    ResendVerificationService,
    LoginService,
    LogoutService,
    ForgotPasswordService,
    VerifyForgotPasswordService,
    ResetPasswordService,
    ChangePasswordService,
    RefreshTokenService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
