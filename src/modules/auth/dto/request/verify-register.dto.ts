import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, Min, Max } from 'class-validator';

export class VerifyEmailRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to verify',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: 123456,
    description: '6-digit verification code sent to the email',
    required: true,
    minimum: 100000,
    maximum: 999999,
  })
  @IsInt({ message: 'Code must be an integer' })
  @Min(100000, { message: 'Code must be at least 6 digits' })
  @Max(999999, { message: 'Code cannot exceed 6 digits' })
  code: number;
}
