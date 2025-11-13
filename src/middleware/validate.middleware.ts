import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            message: 'Validation error',
            details: error.issues,
          },
        });
      } else {
        next(error);
      }
    }
  };
};
