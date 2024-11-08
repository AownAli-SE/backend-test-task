import "./config/envConfig";
import { connectDD } from "./config/database";
import app from "./app";
import { logError } from "./services/loggingService";

// Connecting to database
connectDD();

// Spinning up express server
const port = process.env.PORT ? +process.env.PORT : 8000;
try {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
} catch (error) {
  logError(`Server not starting on port ${port}`, error, null);
}
