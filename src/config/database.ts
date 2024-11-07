import mongoose from "mongoose";

const dbServerUrl = process.env.DB_SERVER_URL;
const dbName = process.env.DB_NAME;
const dbConnectionString = `${dbServerUrl}/${dbName}`;

export async function connectDD() {
  try {
    await mongoose.connect(dbConnectionString);
    console.log("connected to database");
  } catch (err) {
    console.log("Failed to connect to database", err);
    process.exit(1);
  }
}
