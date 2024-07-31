import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    const method = req.method;
    const url = req.originalUrl;

    res.on('finish', () => {
      this.logger.log(
        `${method} ${url} ${res.statusCode} ${Date.now() - now} ms`,
      );
    });

    next();
  }
}
