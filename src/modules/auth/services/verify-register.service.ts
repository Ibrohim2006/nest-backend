import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VerifyEmailRequestDto } from '../dto/request/verify-email.dto';
import { VerifyEmailResponseDto } from '../dto/response/verify-email.dto';
import { RedisService } from '../../redis/redis.service';
import { VerificationData } from '../interfaces/verification-data.interface';
import { UsersService } from '../../users/services/user.service';

@Injectable()
export class VerifyEmailService {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async execute(data: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
    const user = await this.usersService.findByEmailPublic(data.email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified)
      throw new BadRequestException('Email is already verified');

    const key = `email_verification:${user.id}:register`;
    const blockedKey = `email_verification:${user.id}:blocked`;

    const isBlocked = await this.redisService.get(blockedKey);
    if (isBlocked) {
      const ttl = await this.redisService.getTtl(blockedKey);
      const hoursLeft = Math.ceil(ttl / 3600);
      throw new BadRequestException(
        `Too many attempts. Try again in ${hoursLeft} hour(s)`,
      );
    }

    const raw = await this.redisService.get(key);
    if (!raw) {
      throw new NotFoundException('Verification code not found or expired');
    }

    const verification: VerificationData = JSON.parse(raw);

    if (verification.code !== String(data.code)) {
      verification.attempts += 1;

      if (verification.attempts >= 5) {
        await this.redisService.del(key);
        await this.redisService.set(blockedKey, '1', 86400);
        throw new BadRequestException(
          'Too many attempts. Try again in 24 hours',
        );
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
    await this.redisService.del(blockedKey);

    user.isVerified = true;
    await this.usersService.save(user);

    return {
      message: 'Email verified successfully!',
      isVerified: true,
    };
  }
}
