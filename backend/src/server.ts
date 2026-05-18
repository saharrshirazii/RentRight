// import express,  { Response, type Application, type Request } from 'express';
import dotenv from 'dotenv';
import app from './app';
import { connectToDatabase } from './config/database';



dotenv.config();

const PORT = process.env.PORT || 3000;


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

