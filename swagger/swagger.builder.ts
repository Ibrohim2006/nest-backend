import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';

export class SwaggerBuilder {
  static make(app: INestApplication): void {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Nest APIs') 
      .setDescription('All Nest APIs') 
      .setVersion('1.0') 
      .addBearerAuth({
        type: 'http', 
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Please enter user token',
      })
      .setExternalDoc('OpenAPI Specification', '/api-json') 
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      operationIdFactory: (_controllerKey, methodKey) => methodKey,
    });

    SwaggerModule.setup('/', app, document, {
      swaggerOptions: {
        persistAuthorization: true, 
        docExpansion: 'none', 
      },
    });

    app.use('/api-json', (_: Request, res: Response) => {
      res.json(document);
    });
  }
}
