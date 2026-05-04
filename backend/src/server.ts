import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server körs på http://localhost:${PORT}`);
    });
    await connectDB();
  } catch (error) {
    console.error("❌ Serverfel:", error);
  }
};

startServer();
