import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected Successfully");
    } catch (err) {
        console.log("DB Connection Failed : " + err);
    }
};