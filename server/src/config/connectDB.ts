import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is missing.");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
  } catch (err) {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  }
};