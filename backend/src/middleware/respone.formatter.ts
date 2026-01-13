import type { Request, Response, NextFunction } from 'express';

export const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (data: any) {
    // Extract message if it exists in the data
    const message = data?.message;
    const cleanData = data?.message ? { ...data, message: undefined } : data;

    const formatted = {
      ...cleanData,
      ...(message && { message }),
    };
    return originalJson.call(this, formatted);
  };

  next();
};
