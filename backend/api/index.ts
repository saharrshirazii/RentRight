import mongoose from 'mongoose';
import app from '../src/app';

let connectionPromise: Promise<typeof mongoose> | null = null;

export default async function handler(req: any, res: any) {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    res.status(500).json({ message: 'MONGODB_URI is not configured.' });
    return;
  }

  if (mongoose.connection.readyState !== 1) {
    connectionPromise ??= mongoose.connect(uri);
    await connectionPromise;
  }

  return app(req, res);
}
