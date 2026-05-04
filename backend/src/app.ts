import express from 'express';
import cors from 'cors';
import listningRoutes from './routes/listningRoutes';
import { uploadDirectory } from './config/upload';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDirectory));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RentRight backend är uppe!' });
});

app.use('/api/listnings', listningRoutes);

export default app;
