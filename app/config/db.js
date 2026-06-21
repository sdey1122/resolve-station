const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from environment variables");
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${connection.connection.name}`);
  } catch (error) {
    console.error(`Database Connection Failed: ${error.message}`);

    process.exit(1);
  }
};

module.exports = connectDB;
