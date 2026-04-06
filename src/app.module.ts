import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
