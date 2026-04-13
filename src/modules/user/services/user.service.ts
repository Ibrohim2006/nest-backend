import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class UsersService {
  private readonly CACHE_TTL = 300;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {}

  async findByIdPublic(id: string): Promise<UserEntity | null> {
    const cacheKey = `user:public:${id}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'isVerified'],
    });

    if (user) {
      await this.redisService.set(cacheKey, JSON.stringify(user), this.CACHE_TTL);
    }

    return user;
  }

  async findByEmailPublic(email: string): Promise<UserEntity | null> {
    const cacheKey = `user:public:email:${email}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'isVerified'],
    });

    if (user) {
      await this.redisService.set(cacheKey, JSON.stringify(user), this.CACHE_TTL);
    }

    return user;
  }

  async findByIdPrivate(id: string): Promise<UserEntity | null> {
    const cacheKey = `user:private:${id}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'isVerified', 'password'],
    });

    if (user) {
      await this.redisService.set(cacheKey, JSON.stringify(user), this.CACHE_TTL);
    }

    return user;
  }

  async findByEmailPrivate(email: string): Promise<UserEntity | null> {
    const cacheKey = `user:private:email:${email}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'isVerified', 'password'],
    });

    if (user) {
      await this.redisService.set(cacheKey, JSON.stringify(user), this.CACHE_TTL);
    }

    return user;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const saved = await this.userRepository.save(user);
    await this.invalidateCache(saved);
    return saved;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
    await Promise.all([
      this.redisService.del(`user:public:${id}`),
      this.redisService.del(`user:private:${id}`),
    ]);
  }

  async invalidateCache(user: UserEntity): Promise<void> {
    await Promise.all([
      this.redisService.del(`user:public:${user.id}`),
      this.redisService.del(`user:private:${user.id}`),
      this.redisService.del(`user:public:email:${user.email}`),
      this.redisService.del(`user:private:email:${user.email}`),
    ]);
  }
}
