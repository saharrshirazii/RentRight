// import express,  { Response, type Application, type Request } from 'express';
import dotenv from 'dotenv';
import app from './app';
import { connectToDatabase } from './config/database';
//import connectDB from './config/database';


dotenv.config();

const PORT = process.env.PORT || 3002;


const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectToDatabase();
        
app.listen(Number(PORT), '0.0.0.0', () => {
                console.log(`Server is running at http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Failed to start the engine:', error);
        process.exit(1);
    }
};

startServer();


// const PORT = process.env.PORT || 3002;

// const startServer = async () => {
//  try {
//     //Anslut till MongoDB FÖRST
//    await connectDB();
    
//    // Starta servern SEDAN
//    app.listen(PORT, () => {
//      console.log(`🚀 Server körs på http://localhost:${PORT}`);
//      console.log(`📡 MongoDB ansluten (Atlas)`);
//    });
//  } catch (error) {
//    console.error("❌ Serverfel:", error);
//    process.exit(1);
//  }
// };

// startServer();
