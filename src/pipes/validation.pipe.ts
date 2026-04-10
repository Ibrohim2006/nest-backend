import {
  ValidationPipe as NestValidationPipe,
  BadRequestException,
} from '@nestjs/common';

export const CustomValidationPipe = new NestValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors) => {
    const messages = errors.flatMap((err) =>
      Object.values(err.constraints || {}),
    );
    return new BadRequestException({
      statusCode: 400,
      message: messages,
      error: 'Validation error',
    });
  },
});
