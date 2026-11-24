import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import propertyRouter from './routes/propertyRouter';
import listningRoutes from './routes/listningRoutes';
import userRouter from './routes/users';
import authRoutes from './routes/auth';
import bookingRouter from './routes/bookingRoutes';
import messageRoutes from './routes/messageRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import reviewRoutes from './routes/reviewRoutes';
import privacyRoutes from './routes/privacyRoutes';

import errorHandler from './middleware/errorMiddleware';
import { notFound } from './middleware/notfoundMiddleware';
import { uploadDirectory } from './config/upload';
import { logger } from './logger/logger';
import { connectToDatabase } from './config/database';

const pinoHttp = require('pino-http');
const crypto = require('crypto');

const app: Application = express();



app.use(
  pinoHttp({
    logger,
    genReqId: (req: Request) => req.headers['x-request-id'] || crypto.randomUUID(),
    customLogLevel: (req: Request, res: Response, err: any) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
  }),
);

//Security & Parser Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:8080',
      'https://rentright-nine.vercel.app',
      'https://rentright-ten.vercel.app',
      'https://rentright-one.vercel.app',
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ];

    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
}));

app.use(express.json());
app.use('/uploads', express.static(uploadDirectory));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/src/assets')));

// Ensure MongoDB is connected before handling requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        next(error);
    }
});


app.use((req, res, next) => {
  console.log(`Backend mottog: ${req.method} ${req.url}`);
  next();
});

app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listnings', listningRoutes);
app.use('/api/v1/bookings', (req, res, next) => {
  console.log('Bokningsrutten nåddes!');
  bookingRouter(req, res, next);
});
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/privacy', privacyRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'RentRight API is ready' });
});

app.use(notFound);
app.use(errorHandler);

export default app;