const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Validate required env var
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required in backend/.env');
}

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Test connection
const testConnection = async () => {
  try {
    return mongoose.connection.readyState === 1; // 1 = connected
  } catch (error) {
    console.error('❌ MongoDB test connection failed:', error.message);
    return false;
  }
};

module.exports = { connectDB, testConnection };
