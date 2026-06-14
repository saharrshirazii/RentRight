import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
//Routes
import propertyRouter from './routes/propertyRouter'; 
import listningRoutes from './routes/listningRoutes';
import userRouter from './routes/users';
import authRoutes from './routes/auth';
import bookingRouter from './routes/bookingRoutes';
import messageRoutes from './routes/messageRoutes';
import favoriteRoutes from './routes/favoriteRoutes';

//middleware
import errorHandler from './middleware/errorMiddleware';
import { notFound } from './middleware/notfoundMiddleware';
import { uploadDirectory } from './config/upload';

import {logger} from './logger/logger'
const pinoHttp = require('pino-http');
const crypto = require('crypto');


import privacyRoutes from './routes/privacyRoutes';

const app: Application = express();


//Pino HTTP logging
app.use(
  pinoHttp({
    logger,
    genReqId: (req:Request) => req.headers['x-request-id'] || crypto.randomUUID(),
    customLogLevel: (req:Request, res:Response, err: any) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    }
  })
);


//Security & Parser Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma']
}));

app.use(express.json());


//Static Assests
app.use('/uploads', express.static(uploadDirectory));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/src/assets')));


//API Endpoints
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listnings', listningRoutes);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/privacy', privacyRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'RentRight API is ready' });
});


//Error Interceptors
app.use(notFound);      
app.use(errorHandler);

export default app;