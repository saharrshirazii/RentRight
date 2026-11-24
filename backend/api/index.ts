
import 'dotenv/config';
import app from '../src/app';
import { connectToDatabase } from '../src/config/database';

let databaseConnection: Promise<unknown> | null = null;

export default async function handler(req: any, res: any) {
  try {
    if (!databaseConnection) {
      databaseConnection = connectToDatabase();
    }

    await databaseConnection;

    return app(req, res);
  } catch (error) {
    console.error('Backend initialization failed:', error);
    databaseConnection = null;

    return res.status(500).json({
      message: 'Backend initialization failed',
    });
  }
}
