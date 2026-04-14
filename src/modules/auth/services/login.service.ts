import { RedisService } from '@/modules/redis/redis.service';
import { UsersService } from '@/modules/user/services/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from '../dto/request/login.dto';
import { LoginResponseDto } from '../dto/response/login.dto';
import { ConfigService } from '@/config/config.service'; 
import { StringValue } from 'ms';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async execute(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmailPrivate(data.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (user.isBlocked) {
      throw new BadRequestException('Your account is blocked');
    }

    if (!user.isVerified) {
      throw new BadRequestException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password!,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const jti = uuidv4();

    const accessSecret = this.configService.jwt.accessSecret;
    const accessExpiresIn = this.configService.jwt.accessExpiresIn;

    const refreshSecret = this.configService.jwt.refreshSecret;
    const refreshExpiresIn = this.configService.jwt.refreshExpiresIn;

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'access', jti },
      {
        secret: accessSecret,
        expiresIn: accessExpiresIn as StringValue,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'refresh', jti },
      {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as StringValue,
      },
    );

    const ttl = this.parseTtl(refreshExpiresIn);

    await this.redisService.set(`refresh_token:${user.id}`, refreshToken, ttl);

    return { accessToken, refreshToken };
  }

  private parseTtl(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 'd':
        return value * 86400;
      case 'h':
        return value * 3600;
      case 'm':
        return value * 60;
      default:
        return parseInt(expiresIn);
    }
  }
}