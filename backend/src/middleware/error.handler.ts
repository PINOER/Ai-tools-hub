import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

const getFieldDisplayName = (fieldName: string): string => {
  const fieldMap: Record<string, string> = {
    username: 'Username',
    email: 'Email',
    url_slug: 'URL slug',
    name: 'Name',
    title: 'Title',
    term: 'Term',
  };

  return fieldMap[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.log(err);
  console.log(err.message, err.status);
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      errors: err.errors.map((error) => ({
        path: error.path.join('.'),
        message: error.message,
      })),
    });
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Extract field name from the error
      const target = err.meta?.target as string[] | undefined;
      const fieldName = target?.[0] || 'field';
      const fieldDisplayName = getFieldDisplayName(fieldName);

      res.status(409).json({
        success: false,
        message: `${fieldDisplayName} already exists`,
        field: fieldName,
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Record not found',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Database error',
      details: err.message,
    });
    return;
  }

  if (err.message) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
