// const mongoose = require ("mongoose");
import mongoose from 'mongoose';

async function connectToDatabase(){
    try{
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is not defined");

        await mongoose.connect(uri);
        console.log("Connected to Database.");
    }catch(error){
        console.error("Could not connect to MongoDB" , error);
        process.exit(1);
    }
}

export { connectToDatabase };