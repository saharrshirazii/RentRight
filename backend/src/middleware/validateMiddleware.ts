import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors/AppError';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // This parses req.body, req.query, and req.params all at once
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Create a readable string of all validation errors
        const message = error.errors.map(e => `${e.path[1] || e.path[0]}: ${e.message}`).join(', ');
        return next(new ValidationError(message));
      }
      next(error);
    }
  };