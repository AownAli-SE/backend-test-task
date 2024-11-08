import mongoose from "mongoose";
import { logError, logInfo } from "../services/loggingService";

const dbServerUrl = process.env.DB_SERVER_URL;
const dbName = process.env.DB_NAME;
const dbConnectionString = `${dbServerUrl}/${dbName}`;

export async function connectDD() {
  try {
    await mongoose.connect(dbConnectionString);
    console.log("connected to database");
    logInfo("Successfully connected to database", null);
  } catch (err) {
    logError("Failed to connect to database", err, null);
    process.exit(1);
  }
}
