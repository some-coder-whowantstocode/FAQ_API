const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    return true;
  } catch (error) {
    console.warn("Error occured at connectDB : ", error);
    return false;
  }
};

module.exports = { connectDB };
