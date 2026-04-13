import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { databaseConfig } from './core/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    ConfigModule,
    RedisModule,
    MailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
