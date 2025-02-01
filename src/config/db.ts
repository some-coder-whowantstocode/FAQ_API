import mongoose from "mongoose";

export const connectDB = async() : Promise<boolean>=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        return true;
    } catch (error) {
        console.warn("Error occured at connectDB : ",error);
        return false;
    }
}