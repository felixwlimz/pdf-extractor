import mongoose from "mongoose";

const connectDB = async (): Promise<boolean> => {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Mongodb connected");
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    return false;
  }
};

export default connectDB;