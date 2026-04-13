import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogoutService {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string): Promise<{ message: string; ok: boolean }> {
    const blacklistKey = `blacklist:${token}`;

    const already = await this.redisService.get(blacklistKey);
    if (already) {
      throw new BadRequestException('Token is already blacklisted');
    }

    const decoded = this.jwtService.decode(token);
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded?.exp ? decoded.exp - now : 3600;

    if (ttl > 0) {
      await this.redisService.set(blacklistKey, '1', ttl);
    }

    return { message: 'Logged out successfully', ok: true };
  }
}
