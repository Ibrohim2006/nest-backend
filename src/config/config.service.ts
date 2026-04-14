import { Injectable } from '@nestjs/common';
import { databaseConfig, DatabaseConfig } from './database/databae.config';
import { mailConfig, MailConfig } from './mail/mail.config';
import { redisConfig, RedisConfig } from './redis/redis.config';
import { jwtConfig, JwtConfig } from './jwt/jwt.config';

@Injectable()
export class ConfigService {
  private readonly dbConfig: DatabaseConfig;
  private readonly rConfig: RedisConfig;
  private readonly mConfig: MailConfig;
  private readonly jConfig: JwtConfig;

  constructor() {
    this.dbConfig = databaseConfig();
    this.rConfig = redisConfig();
    this.mConfig = mailConfig();
    this.jConfig = jwtConfig();

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

  get mail(): MailConfig {
    return this.mConfig;
  }

  get jwt(): JwtConfig {
    return this.jConfig;
  }
}