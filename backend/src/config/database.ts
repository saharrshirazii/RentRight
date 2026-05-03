import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI saknas i .env filen");
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas ansluten!");
  } catch (error: any) {
    console.error("❌ MongoDB anslutningsfel:", error.message);
    process.exit(1);
  }
};

export default connectDB;