// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We use process.env.MONGO_URI which we will set in our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;