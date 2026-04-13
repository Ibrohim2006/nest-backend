import { Module, Global } from '@nestjs/common';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@/config/config.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    IoRedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.redis.url,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
