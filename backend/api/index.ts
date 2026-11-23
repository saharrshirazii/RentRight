import mongoose from 'mongoose';
import app from '../src/app';

let connectionPromise: Promise<typeof mongoose> | null = null;

export default async function handler(req: any, res: any) {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      res.status(500).json({ message: 'MONGODB_URI is not configured.' });
      return;
    }

    if (mongoose.connection.readyState !== 1) {
      connectionPromise ??= mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      await connectionPromise;
    }

    return app(req, res);
  } catch (error: any) {
    console.error('Vercel backend invocation failed:', error);
    res.status(500).json({
      message: 'Backend function failed.',
      error: error?.message || 'Unknown serverless error',
    });
  }
}
