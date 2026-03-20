const mongoose = require("mongoose");

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI. Add it to backend/.env before starting the server.");
  }

  const dbName = process.env.MONGODB_DB_NAME || "caelifi";

  await mongoose.connect(mongoUri, {
    dbName,
  });

  console.log(`MongoDB connected (${dbName})`);
};

module.exports = {
  connectToDatabase,
};
