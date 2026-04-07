import { Injectable } from '@nestjs/common';
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
import { RegisterRequestDto } from './dto/request/register.dto';
import { RegisterResponseDto } from './dto/response/register.dto';
import { VerifyEmailRequestDto } from './dto/request/verify-email.dto';
import { VerifyEmailResponseDto } from './dto/response/verify-email.dto';
import { LoginRequestDto } from './dto/request/login.dto';
import { LoginResponseDto } from './dto/response/login.dto';
import { LogoutResponseDto } from './dto/response/logout.dto';
import { ResendVerificationResponseDto } from './dto/response/resend-email.dto';
import { ResendVerificationRequestDto } from './dto/request/resend-email.dto';
import { ForgotPasswordRequestDto } from './dto/request/forgot-password.dto';
import { ForgotPasswordResponseDto } from './dto/response/forgot-password.dto';
import { VerifyForgotPasswordRequestDto } from './dto/request/verify-forgot-password.dto';
import { VerifyForgotPasswordResponseDto } from './dto/response/verify-forgot-password.dto';
import { ResetPasswordRequestDto } from './dto/request/reset-password.dto';
import { ResetPasswordResponseDto } from './dto/response/reset-password.dto';
import { ChangePasswordRequestDto } from './dto/request/change-password.dto';
import { ChangePasswordResponseDto } from './dto/response/change-password.dto';
import { RefreshTokenRequestDto } from './dto/request/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/response/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerService: RegisterService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly resendVerificationService: ResendVerificationService,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly verifyForgotPasswordService: VerifyForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  register(data: RegisterRequestDto): Promise<RegisterResponseDto> {
    return this.registerService.execute(data);
  }

  verifyEmail(data: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
    return this.verifyEmailService.execute(data);
  }

  resendVerificationCode(
    data: ResendVerificationRequestDto,
  ): Promise<ResendVerificationResponseDto> {
    return this.resendVerificationService.execute(data);
  }

  login(data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginService.execute(data);
  }

  logout(token: string): Promise<LogoutResponseDto> {
    return this.logoutService.execute(token);
  }

  forgotPassword(
    data: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.forgotPasswordService.execute(data);
  }

  verifyForgotPassword(
    data: VerifyForgotPasswordRequestDto,
  ): Promise<VerifyForgotPasswordResponseDto> {
    return this.verifyForgotPasswordService.execute(data);
  }

  resetPassword(
    data: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.resetPasswordService.execute(data);
  }

  changePassword(
    userId: string,
    dto: ChangePasswordRequestDto,
  ): Promise<ChangePasswordResponseDto> {
    return this.changePasswordService.execute(userId, dto);
  }

  refreshToken(
    dto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenService.execute(dto);
  }
}
