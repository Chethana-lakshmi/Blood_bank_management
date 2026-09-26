const mongoose = require('mongoose');

let isConnecting = false;

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ [MongoDB] MONGODB_URI environment variable is not defined.');
    console.error('👉 Please set MONGODB_URI in backend/.env or your deployment environment variables.');
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return null;
  }

  isConnecting = true;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnecting = false;
    console.log(`✅ [MongoDB] Connected successfully to Atlas: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    isConnecting = false;
    console.error(`❌ [MongoDB] Connection error: ${err.message}`);
    if (
      err.message.includes('whitelist') ||
      err.message.includes('alert internal error') ||
      err.message.includes('alert number 80')
    ) {
      console.error('🔒 [MongoDB] IP not whitelisted in Atlas Network Access. Add 0.0.0.0/0 to allow connections.');
    }
    return null;
  }
};

const isDBConnected = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isDBConnected = isDBConnected;
