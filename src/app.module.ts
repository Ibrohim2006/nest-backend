import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';
import { MailModule } from './modules/mail/mail.module';
import { OtpModule } from './otp/otp.module';
@Module({
  imports: [ConfigModule, AuthModule, RedisModule, MailModule, OtpModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
