const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Try multiple possible paths for .env
const possiblePaths = [
  path.resolve(__dirname, '../../.env'),       // backend/src/config/../../.env -> backend/.env
  path.resolve(process.cwd(), '.env'),         // current working directory/.env
  path.resolve(process.cwd(), 'backend/.env'), // cwd/backend/.env
];

const existingPaths = possiblePaths.filter(fs.existsSync);

let envLoaded = false;
let loadedPath = null;

for (const envPath of existingPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    envLoaded = true;
    loadedPath = envPath;
    console.log(`✅ Loaded .env from: ${envPath}`);
    break;
  }
}

if (!envLoaded && process.env.MONGODB_URI) {
  console.log('✅ Using MONGODB_URI from environment variables');
}

if (!envLoaded && !process.env.MONGODB_URI) {
  console.error('❌ Could not find .env file. Searched paths:');
  possiblePaths.forEach(p => console.error(`   - ${p}`));
  throw new Error('MONGODB_URI is required in backend/.env or environment');
}

// Validate required env var
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file at:', loadedPath);
  console.error('Please ensure MONGODB_URI is defined in your .env file');
  throw new Error('MONGODB_URI is required in backend/.env');
}

// Hide credentials in logs
const sanitizedUri = process.env.MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@');
console.log('📡 MongoDB URI configured:', sanitizedUri);

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