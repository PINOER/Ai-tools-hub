// validation.middleware.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError, ZodSchema } from 'zod';

type SchemaGroup = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validateRequest = (schemas: SchemaGroup): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.validatedBody = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.validatedParams = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        req.validatedQuery = schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};
