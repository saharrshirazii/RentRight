import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    //log the error 
   if(!err.isOperational){
    console.error('CRITICAL ERROR:' , err);     // Unexpected programming error - log aggressively
   }else{
    console.warn('APPLICATION ERROR:' , err.message);     // Expected application error - log at a lower level
   }

     // If it's an AppError, use its status code
   if(err instanceof AppError){
    return res.status(err.statusCode).json({
        message: err.message,
        errors: err.errors,
    });
   }

   //Handle Mangoose ValidationError
   if(err.name === 'ValidationError'){
    const errors = Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message,
    }));

    return res.status(400).json({
        message: 'Validation error',
        errors,
    });
   }

   //Handles Mongoose CastError (invalid ObjectId format)
   if(err.name === 'CastError'){
    return res.status(400).json({
        message: 'Invalid ID format',
    });
   }
    
  // Unexpected error - never expose details in production
    const message = 
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'An unexpected server error occurred';

  res.status(500).json({ message });
};


export default errorHandler;