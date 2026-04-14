import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/user.service';
import { UserController } from './user.controller';
import { UserService } from './user.service'
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RedisModule],
  controllers: [UserController],
  providers: [UsersService, UserService],
  exports: [UsersService],
})
export class UserModule {}
