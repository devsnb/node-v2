import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggingMiddleware } from './middlewares/logger.middleware';
import { CalcModule } from './calc/calc.module';

@Module({
  imports: [CalcModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
