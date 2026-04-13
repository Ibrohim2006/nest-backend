import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'User password (minimum 8 characters, at least one uppercase letter)',
    required: true,
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password confirmation, must match password',
    required: true,
    minLength: 8,
  })
  @IsString({ message: 'Password confirmation must be a string' })
  @MinLength(8, {
    message: 'Password confirmation must be at least 8 characters',
  })
  @Matches(/[A-Z]/, {
    message: 'Password confirmation must contain at least one uppercase letter',
  })
  password_confirm: string;
}
