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


//const connectDB = async () => {
//  try {
//    const uri = process.env.MONGODB_URI;
//    if (!uri) {
//      console.warn("⚠️ MONGODB_URI saknas. Servern startar utan MongoDB.");
//      return;
//    }
//     await mongoose.connect(uri);
//    console.log("✅ MongoDB Atlas ansluten!");
 // } catch (error: any) {
//    console.warn("⚠️ MongoDB anslutningsfel:", error.message);
//    console.warn("Servern fortsätter utan MongoDB för lokala in-memory endpoints.");
//  }
//};

//export default connectDB;
