import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail.service';
import { RegisterRequestDto } from '../dto/request/register.dto';
import { RegisterResponseDto } from '../dto/response/register.dto';
import { RedisService } from '../../redis/redis.service';
import { UsersService } from '../../users/services/user.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}

  async execute(data: RegisterRequestDto): Promise<RegisterResponseDto> {
    if (data.password !== data.password_confirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersService.findByEmailPublic(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const savedUser = await this.usersService.save({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      isVerified: false,
      isActive: false,
    } as any);

    const code = Math.floor(100000 + Math.random() * 900000);
    const key = `email_verification:${savedUser.id}:register`;

    await this.redisService.set(
      key,
      JSON.stringify({ code: code.toString(), attempts: 0 }),
      300,
    );

    try {
      await this.mailService.sendVerificationEmail(
        savedUser.email,
        savedUser.username,
        code,
      );
    } catch (error) {
      console.error('Error sending verification email:', error);
    }

    return {
      email: savedUser.email,
      isVerified: savedUser.isVerified,
      message: 'Registration successful! Please check your email to verify your account.',
    };
  }
}
