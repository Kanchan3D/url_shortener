import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Failed", err);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
