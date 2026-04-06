import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { cleanupOpenApiDoc } from 'nestjs-zod';

export class SwaggerBuilder {
  static make(app: INestApplication): void {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Nest APIs')
      .setDescription('All Nest APIs')
      .setVersion('1.0')
      .addBearerAuth({
        description: `Please enter User token`,
        type: 'http',
      })
      .setExternalDoc('OpenAPI Specification', '/api-json')
      .build();

    const document = cleanupOpenApiDoc(
      SwaggerModule.createDocument(app, swaggerConfig, {
        operationIdFactory: (_controllerKey, methodKey) => methodKey,
      }),
    );

    SwaggerModule.setup('/', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
      },
    });

    app.use('/api-json', (_: Request, res: Response) => res.json(document));
  }
}
