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
import { VerifyEmailRequestDto } from './dto/request/verify-register.dto';
import { VerifyEmailResponseDto } from './dto/response/verify-register.dto';
import { LoginRequestDto } from './dto/request/login.dto';
import { LoginResponseDto } from './dto/response/login.dto';
import { LogoutResponseDto } from './dto/response/logout.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

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
}
