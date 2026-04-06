import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { SwaggerBuilder } from './swagger/swagger.builder';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      rawBody: true,
    });

    app.setGlobalPrefix('/api/v1');

    app.useGlobalPipes(new ZodValidationPipe());

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    SwaggerBuilder.make(app);

    const configService = app.get(ConfigService);
    const port = configService.get('APP_PORT');

    await app.listen(port);

    const appUrl = await app.getUrl();

    logger.log(`Application is running on: ${appUrl}`);
  } catch (error) {
    logger.error('Application bootstrap failed:', error);
    process.exit(1);
  }
}

void bootstrap();
