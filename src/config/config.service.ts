import { Injectable } from '@nestjs/common';
import { databaseConfig, DatabaseConfig } from './database/databae.config';
import { redisConfig, RedisConfig } from './redis/redis.config';

@Injectable()
export class ConfigService {
  private readonly dbConfig: DatabaseConfig;
  private readonly rConfig: RedisConfig;

  constructor() {
    this.dbConfig = databaseConfig();
    this.rConfig = redisConfig();

    if (!process.env.APP_PORT || !process.env.NODE_ENV) {
      throw new Error('APP_PORT or NODE_ENV is not set in .env');
    }
  }

  get appPort(): number {
    return parseInt(process.env.APP_PORT!, 10);
  }

  get nodeEnv(): 'development' | 'production' | 'test' {
    return process.env.NODE_ENV as any;
  }

  get database(): DatabaseConfig {
    return this.dbConfig;
  }

  get redis(): RedisConfig {
    return this.rConfig;
  }
}
