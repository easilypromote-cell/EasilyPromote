const mongoose = require("mongoose");
const dns = require("dns");

// Ensure Node.js prioritizes IPv4 resolution for DNS SRV queries (MongoDB Atlas)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// Bind connection events for real-time monitoring
mongoose.connection.on("connected", () => {
  console.log(`[MongoDB] Connection active on host: ${mongoose.connection.host}`);
});

mongoose.connection.on("error", (err) => {
  console.error(`[MongoDB] Runtime connection error:`, {
    name: err.name,
    message: err.message,
    code: err.code,
  });
});

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Connection lost/disconnected. Mongoose is attempting to reconnect...");
});

mongoose.connection.on("reconnected", () => {
  console.log("[MongoDB] Connection re-established successfully.");
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("[MongoDB] Error: MONGODB_URI is missing from environment variables!");
    process.exit(1);
  }

  // Mask password for safe logging
  const maskedUri = uri.replace(/:([^@]+)@/, ":****@");
  console.log(`[MongoDB] Attempting connection to ${maskedUri}...`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s if unreachable
    });
    console.log(`[MongoDB] Connected successfully! Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Initial connection failed! Details:`);
    console.error(`  - Name:    ${error.name}`);
    console.error(`  - Message: ${error.message}`);
    if (error.code) console.error(`  - Code:    ${error.code}`);

    // Contextual diagnostic hints
    if (error.message.includes("querySrv") || error.code === "ECONNREFUSED") {
      console.error(`[MongoDB Diagnostic Hint] DNS/SRV lookup failed. Verify internet connection, DNS server, or corporate VPN/firewall settings.`);
    } else if (error.message.includes("bad auth") || error.codeName === "AuthenticationFailed") {
      console.error(`[MongoDB Diagnostic Hint] Authentication failed. Verify database credentials in .env.`);
    } else if (error.name === "MongooseServerSelectionError") {
      console.error(`[MongoDB Diagnostic Hint] Server selection timed out. Verify MongoDB Atlas IP Whitelist (Network Access) includes your current IP.`);
    }

    process.exit(1);
  }
};

module.exports = connectDB;


