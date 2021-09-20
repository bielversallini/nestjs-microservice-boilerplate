import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { OpenTelemetryModule } from 'nestjs-otel';
import { validate } from './env.validation';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    OpenTelemetryModule.forRoot(),
    ConfigModule.forRoot({
      validate,
    }),
    CoreModule,
  ],
})
export class AppModule {}
