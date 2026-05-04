import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn("⚠️ MONGODB_URI saknas. Servern startar utan MongoDB.");
      return;
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas ansluten!");
  } catch (error: any) {
    console.warn("⚠️ MongoDB anslutningsfel:", error.message);
    console.warn("Servern fortsätter utan MongoDB för lokala in-memory endpoints.");
  }
};

export default connectDB;
