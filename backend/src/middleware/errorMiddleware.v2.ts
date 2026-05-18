import { Request, Response, NextFunction } from 'express';


interface ErrorResponse {
    message: string;
    errors?: any;
    stack?: string;
}
function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    //log the error for internal diagnos
    console.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    //determine status code
    const statusCode = err.statusCode || 500;

    //Build a consistent error response
    const response: ErrorResponse = {
        message: err.message || 'An unxpected error occurred.',
        errors: err.errors || undefined,
    };

    //In production, DO NOT expose stack traces or internal details
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    //500 error should not expose internal details to the client
    if (statusCode === 500) {
        response.message = 'An unexpected server error occurred.';
    }

    res.status(statusCode).json(response);
};

export default errorHandler;