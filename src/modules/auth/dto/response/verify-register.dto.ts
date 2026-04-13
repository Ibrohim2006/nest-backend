import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({
    example: 'Email verified successfully',
    description: 'Response message after email verification',
  })
  message: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the email has been successfully verified',
  })
  isVerified: boolean;
}
