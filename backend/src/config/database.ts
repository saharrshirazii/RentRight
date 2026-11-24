
import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

async function connectToDatabase(): Promise<typeof mongoose> {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI is not defined');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(uri).catch((error) => {
            connectionPromise = null;
            throw error;
        });
    }

    try {
        return await connectionPromise;
    } catch (error) {
        connectionPromise = null;
        throw error;
    }
}

export { connectToDatabase };
