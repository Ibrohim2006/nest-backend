import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/request/register.dto';
import { RegisterResponseDto } from './dto/response/register.dto';
import { VerifyEmailRequestDto } from './dto/request/verify-email.dto';
import { VerifyEmailResponseDto } from './dto/response/verify-email.dto';
import { LoginRequestDto } from './dto/request/login.dto';
import { LoginResponseDto } from './dto/response/login.dto';
import { LogoutResponseDto } from './dto/response/logout.dto';
import { ResendVerificationRequestDto } from './dto/request/resend-email.dto';
import { ResendVerificationResponseDto } from './dto/response/resend-email.dto';
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  @ApiResponse({ status: 409, description: 'User already exists' })
  register(@Body() dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with code' })
  @ApiBody({ type: VerifyEmailRequestDto })
  @ApiResponse({ status: 200, type: VerifyEmailResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  verifyEmail(
    @Body() dto: VerifyEmailRequestDto,
  ): Promise<VerifyEmailResponseDto> {
    return this.authService.verifyEmail(dto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification code' })
  @ApiBody({ type: ResendVerificationRequestDto })
  @ApiResponse({ status: 200, type: ResendVerificationResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  resendVerification(
    @Body() dto: ResendVerificationRequestDto,
  ): Promise<ResendVerificationResponseDto> {
    return this.authService.resendVerificationCode(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(
    @Request() req: { headers: { authorization: string } },
  ): Promise<LogoutResponseDto> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset OTP to email' })
  @ApiBody({ type: ForgotPasswordRequestDto })
  @ApiResponse({ status: 200, type: ForgotPasswordResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Too many attempts' })
  forgotPassword(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.forgotPassword(dto);
  }

  @Post('verify-forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and get reset token' })
  @ApiBody({ type: VerifyForgotPasswordRequestDto })
  @ApiResponse({ status: 200, type: VerifyForgotPasswordResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  verifyForgotPassword(
    @Body() dto: VerifyForgotPasswordRequestDto,
  ): Promise<VerifyForgotPasswordResponseDto> {
    return this.authService.verifyForgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using reset token' })
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({ status: 200, type: ResetPasswordResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  resetPassword(
    @Body() dto: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(dto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Change password (authenticated user)' })
  @ApiBody({ type: ChangePasswordRequestDto })
  @ApiResponse({ status: 200, type: ChangePasswordResponseDto })
  @ApiResponse({ status: 400, description: 'Old password is incorrect' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  changePassword(
    @Request() req: { user: { id: string } },
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<ChangePasswordResponseDto> {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get new access token using refresh token' })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({ status: 200, type: RefreshTokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  refreshToken(
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(dto);
  }
}
