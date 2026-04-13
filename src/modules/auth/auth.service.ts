import { Injectable } from '@nestjs/common';
import { RegisterService } from './services/register.service';
import { VerifyEmailService } from './services/register-verify.service';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { RegisterRequestDto } from './dto/request/register.dto';
import { RegisterResponseDto } from './dto/response/register.dto';
import { LoginRequestDto } from './dto/request/login.dto';
import { LoginResponseDto } from './dto/response/login.dto';
import { LogoutResponseDto } from './dto/response/logout.dto';
import { VerifyEmailRequestDto } from './dto/request/verify-register.dto';
import { VerifyEmailResponseDto } from './dto/response/verify-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerService: RegisterService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService
  ) {}

  register(data: RegisterRequestDto): Promise<RegisterResponseDto> {
    return this.registerService.execute(data);
  }

  verifyEmail(data: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
    return this.verifyEmailService.execute(data);
  }

  login(data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginService.execute(data);
  }

  logout(token: string): Promise<LogoutResponseDto> {
    return this.logoutService.execute(token);
  }
}
