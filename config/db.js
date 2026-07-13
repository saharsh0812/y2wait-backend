const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']); 

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("=====================================");
    console.log("🚀 DATABASE CONNECTION SUCCESSFUL!");
    console.log("📍 Connected to Host:", conn.connection.host);
    console.log("📁 Database Name:", conn.connection.name);
    console.log("=====================================");

  } catch (err) {
    console.error("❌ DATABASE CONNECTION FAILED:", err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;