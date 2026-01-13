import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.ts';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const start = Date.now();

  logger.info(`Incoming Request: ${method} ${url}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${res.statusCode} ${method} ${url} - ${duration}ms`);
  });

  next();
};

export default loggerMiddleware;
