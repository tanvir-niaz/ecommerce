import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('E-commerce Backend')
  .setDescription('The e-commerce API description')
  .setVersion('1.0')
  .addTag('e-commerce')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token', // This name must match the one in .addSecurityRequirement
  )
  .build();
