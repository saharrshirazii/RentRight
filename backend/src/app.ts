import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRouter from './routes/users';

const app:Application = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/v1/users' , userRouter);

// Basic Health Check
app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'RentRight API is ready' });
});

// Global Error Handler
app.use((err:any , req:Request , res:Response , next:NextFunction)=>{
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

export default app;
