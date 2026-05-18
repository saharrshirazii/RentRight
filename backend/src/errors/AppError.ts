
//Base error class for all expected application errors
class AppError extends Error {
//Declare the properties here
    public statusCode: number;
    public isOperational: boolean;
    public errors?: any[];


    constructor(message: string, statusCode: number) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = true;     // Distinguishes application errors from programming errors

        Error.captureStackTrace(this, this.constructor);
    }
}

//404 - Resource not found
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404)
    }
}

//400 - Invalid input from cliend 
class ValidationError extends AppError {
    constructor(message = 'Validation Error', errors: any[] = []) {
        super(message, 400);
        this.errors = errors;
    }
}

//401 - Authentication required
class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401); //login is required
    }
}

//403 - Authenticated but lacks permission
class ForbiddenError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403); //loged in but do not have permission
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409); //Duplicate information for example email is duplicate
    }
}

export {
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError
};