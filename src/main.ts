import { NestFactory } from "@nestjs/core";
import "reflect-metadata";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { swaggerConfig } from "./config/swagger.config";
import * as csurf from 'csurf';
async function bootstrap() {
  const app: INestApplication<any> = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig
  );
  SwaggerModule.setup("api", app, document);
  // app.use(csurf())
  await app.listen(3000);
}
bootstrap();
