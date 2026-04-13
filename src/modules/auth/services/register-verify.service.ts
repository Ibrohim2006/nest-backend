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

    // DB da block bo'lganmi?
    if (user.isBlocked) {
      const blockedKey = `email_verification:${user.id}:blocked`;
      const ttl = await this.redisService.getTtl(blockedKey);

      if (ttl > 0) {
        const hoursLeft = Math.ceil(ttl / 3600);
        throw new BadRequestException(
          `Too many attempts. Try again in ${hoursLeft} hour(s)`,
        );
      }

      // TTL tugagan → blockni ochib yuboramiz
      user.isBlocked = false;
      await this.usersService.save(user);
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
        // Redis va DB ga block
        const blockedKey = `email_verification:${user.id}:blocked`;
        await this.redisService.del(key);
        await this.redisService.set(blockedKey, '1', 86400);

        user.isBlocked = true;
        await this.usersService.save(user);

        throw new BadRequestException('Too many attempts. Try again in 24 hours');
      }

      const ttl = await this.redisService.getTtl(key);
      if (ttl > 0) {
        await this.redisService.set(key, JSON.stringify(verification), ttl);
      }

      throw new BadRequestException(
        `Invalid code. Attempts left: ${5 - verification.attempts}`,
      );
    }

    // Kod to'g'ri → verify qilish
    await this.redisService.del(key);
    await this.redisService.del(`email_verification:${user.id}:blocked`);

    user.isVerified = true;
    user.isBlocked = false;
    await this.usersService.save(user);

    return {
      message: 'Email verified successfully!',
      isVerified: true,
    };
  }
}
