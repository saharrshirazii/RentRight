import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import listningRoutes from './routes/listningRoutes';
import { uploadDirectory } from './config/upload';
import userRouter from './routes/users';
import authRoutes from './routes/auth';

const app: Application = express();

app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(uploadDirectory));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listnings', listningRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RentRight backend är uppe!' });
});

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'RentRight API is ready' });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
