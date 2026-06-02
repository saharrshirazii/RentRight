import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import propertyRouter from './routes/propertyRouter'; 
import listningRoutes from './routes/listningRoutes';
import userRouter from './routes/users';
import authRoutes from './routes/auth';
import messageRoutes from './routes/messageRoutes';
import errorHandler from './middleware/errorMiddleware';
import { notFound } from './middleware/notfoundMiddleware';
import { uploadDirectory } from './config/upload';
import favoriteRoutes from './routes/favoriteRoutes';

const app: Application = express();


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.use('/uploads', express.static(uploadDirectory));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/src/assets')));


app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listnings', listningRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/favorites', favoriteRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'RentRight API is ready' });
});


app.use(notFound);      
app.use(errorHandler);

export default app;