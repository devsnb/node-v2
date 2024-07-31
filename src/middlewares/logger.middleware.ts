import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * This is a middleware for logging the request/response info before sending the response
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // start the timer
    const now = Date.now();
    const method = req.method;
    const url = req.originalUrl;

    // on completion of the request we calculate the time it took and log it to the console
    // along with the http method, url & http status
    res.on('finish', () => {
      this.logger.log(
        `${method} ${url} ${res.statusCode} ${Date.now() - now} ms`,
      );
    });

    // call next to let the request through
    // and let this request be handled by other middlewares or the request controller
    next();
  }
}
