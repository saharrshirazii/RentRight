import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './routes/users';
import propertyRouter from './routes/propertyRouter'; 
import errorHandler from './middleware/errorMiddleware';
import { notFound } from './middleware/notfoundMiddleware';
import path from 'path';
import listningRoutes from './routes/listningRoutes';
import { uploadDirectory } from './config/upload';
import userRouter from './routes/users';
import authRoutes from './routes/auth';

const app: Application = express();


// Middleware
// app.use(cors({
//   origin: 'http://localhost:5174', 
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// app.use(cors());

app.use(cors({
 origin: ['http://localhost:3002', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080'],
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization']

// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],

}));

app.use(express.json());
app.use('/uploads', express.static(uploadDirectory));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/src/assets')));

//Routes
//app.use('/api/v1/users' , router);
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listnings', listningRoutes);


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
