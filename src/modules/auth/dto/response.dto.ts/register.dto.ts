import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the registered user',
  })
  email: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user has verified their email',
  })
  isVerified: boolean;

  @ApiProperty({
    example: 'Registration successful. Please verify your email.',
    description: 'Response message after registration',
  })
  message: string;
}
