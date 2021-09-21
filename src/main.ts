import otelSDK from './tracing';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyCsrf from 'fastify-csrf';
import { fastifyHelmet } from 'fastify-helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { setupSwagger } from './core/swagger/swagger';

async function bootstrap() {
  await otelSDK.start();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  app.register(fastifyCookie);
  app.register(fastifyCsrf);

  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  app.enableCors();

  setupSwagger(app);

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
