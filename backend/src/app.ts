import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './routes/users';
import propertyRouter from './routes/propertyRouter'; 
import errorHandler from './middleware/errorMiddleware';
import { notFound } from './middleware/notfoundMiddleware';
import path from 'path';

const app:Application = express();

// Middleware
// app.use(cors({
//   origin: 'http://localhost:5174', 
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, '../../frontend/src/assets')));

//Routes
app.use('/api/v1/users' , router);
app.use('/api/v1/properties', propertyRouter);

// Basic Health Check
app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'RentRight API is ready' });
});

//POST-MIDDLEWARE (FALLBACKS)
app.use(notFound);      
app.use(errorHandler);

// Global Error Handler
// app.use((err:any , req:Request , res:Response , next:NextFunction)=>{
//     const statusCode = err.statusCode || 500;
//     res.status(statusCode).json({
//         status: 'error',
//         message: err.message || 'Internal Server Error',
//     });
// });

export default app;
