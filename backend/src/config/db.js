const mongoose = require ("mongoose");

async function connectToDatabade(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Database.");
    }catch(error){
        console.error("Could not connect to MongoDB" , error.message);
        process.exit(1);
    }
}

module.exports = { connectToDatabase };