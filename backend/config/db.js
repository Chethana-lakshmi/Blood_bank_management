const mongoose = require('mongoose');

let isConnected = false;
let retryTimer = null;

const tryConnect = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
      console.log(`✅ MongoDB Connected (Atlas): ${conn.connection.host}/${conn.connection.name}`);
      return true;
    }
  } catch (err) {
    const isIpBlocked = err.message.includes('whitelist') || err.message.includes('alert internal error') || err.message.includes('alert number 80');
    if (isIpBlocked) {
      console.warn('🔒 Atlas Security: Your IP address is not whitelisted in MongoDB Atlas Network Access.');
      console.warn('👉 Add IP 0.0.0.0/0 (or your current public IP) at: https://cloud.mongodb.com -> Network Access');
    } else {
      console.warn(`⚠️ MongoDB connection attempt failed: ${err.message}`);
    }
  }
  return false;
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set in backend/.env');
    return;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const success = await tryConnect(uri);
  if (success) return;

  // Set up background retry if not already active
  if (!retryTimer) {
    console.log('🔄 Waiting for Atlas IP Whitelist (retrying every 5s)...');
    retryTimer = setInterval(async () => {
      if (mongoose.connection.readyState === 1) {
        isConnected = true;
        clearInterval(retryTimer);
        retryTimer = null;
        return;
      }
      await tryConnect(uri);
    }, 5000);
  }
};

const checkConnection = () => isConnected || mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.checkConnection = checkConnection;
