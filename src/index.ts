import "./config/envConfig";
import cors from "cors";
import { connectDD } from "./config/database";
import app from "./app";

// Connecting to database
connectDD();

// Spinning up express server
const port = process.env.PORT ? +process.env.PORT : 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
