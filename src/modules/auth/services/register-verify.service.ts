import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VerifyEmailRequestDto } from '../dto/request/verify-register.dto';
import { VerifyEmailResponseDto } from '../dto/response/verify-register.dto';
import { RedisService } from '@/modules/redis/redis.service';
import { VerificationData } from '../interfaces/verification-data.interface';
import { UsersService } from '@/modules/user/services/user.service';

@Injectable()
export class VerifyEmailService {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async execute(data: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
    const user = await this.usersService.findByEmailPublic(data.email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified) throw new BadRequestException('Email is already verified');

    if (user.isBlocked) {
      throw new BadRequestException('Your account is blocked');
    }

    const key = `email_verification:${user.id}:register`;
    const raw = await this.redisService.get(key);
    if (!raw) {
      throw new NotFoundException('Verification code not found or expired');
    }

    const verification: VerificationData = JSON.parse(raw);

    if (verification.code !== String(data.code)) {
      verification.attempts += 1;

      if (verification.attempts >= 5) {
        await this.redisService.del(key);

        user.isBlocked = true;
        await this.usersService.save(user);

        throw new BadRequestException('Too many attempts. Your account is blocked');
      }

      const ttl = await this.redisService.getTtl(key);
      if (ttl > 0) {
        await this.redisService.set(key, JSON.stringify(verification), ttl);
      }

      throw new BadRequestException(
        `Invalid code. Attempts left: ${5 - verification.attempts}`,
      );
    }

    await this.redisService.del(key);

    user.isVerified = true;
    await this.usersService.save(user);

    return {
      message: 'Email verified successfully!',
      isVerified: true,
    };
  }
}