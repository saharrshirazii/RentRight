import app from './app';
import * as dotenv from 'dotenv';
import connectDB from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server körs på http://localhost:${PORT}`);
      console.log(`📡 MongoDB ansluten (Atlas)`);
    });
  } catch (error) {
    console.error("❌ Serverfel:", error);
  }
};

startServer();