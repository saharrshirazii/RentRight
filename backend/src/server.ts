import express,  { Response, type Application, type Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import app from './app';
import { connectToDatabade } from './config/database';


dotenv.config();


// const app: Application = express();
const PORT = process.env.PORT || 3000;


const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectToDatabade();
        
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Failed to start the engine:', error);
        process.exit(1);
    }
};

startServer();